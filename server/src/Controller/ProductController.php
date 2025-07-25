<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Images;
use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;


#[Route('/product')]
final class ProductController extends AbstractController
{
    #[Route(name: 'app_product_index', methods: ['GET'])]
//afficher tous les produits
    public function index(ProductRepository $productRepository): Response
    {
        $products = $productRepository->findAll();

        $data = [];
        foreach ($products as $product) {
            $images = [];
            foreach ($product->getImages() as $image) {
                $images[] = $image->getImagePath();
            }
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions(),
                'price' => $product->getPrice(),
                'category' => $product->getCategory() ? $product->getCategory()->getName() : null,
                'images' => $images

            ];
        }
        return $this->json($data);
    }


    #[Route('/admin/new', name: 'app_product_new', methods: ['GET', 'POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Invalid JSON'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Récup id
        $category = $entityManager->getRepository(Category::class)->find($data['category']);

        $product = new Product();
        $product->setName($data['name']);
        $product->setDescriptions($data['descriptions']);
        $product->setPrice($data['price']);

        $product->setCreatedAt(new \DateTimeImmutable());
        $product->setCategory($category);

        $entityManager->persist($product);

        if (isset($data['images'])) {
            foreach ($data['images'] as $imageData) {
                $image = new Images();
                $image->setImagePath($imageData['url']);
                $image->setProductId($product);
                $entityManager->persist($image);
                $product->addImage($image);
            }
        }

        $entityManager->flush();
        $images = [];
        // foreach($product->getImages() as $image){
        //     $images[] = $image;
        // }
        foreach ($product->getImages() as $image) {
            $images[] = [
                'url' => $image->getImagePath()
            ];
        }

        return new JsonResponse([
            'message' => 'Product created ',
            'product' => [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions(),
                'price' => $product->getPrice(),
                'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
                'category' => $product->getCategory()->getName(),
                'image' => $images
            ]
        ], JsonResponse::HTTP_CREATED);
    }

//voir un produit en detail
    #[Route('/{id}', name: 'app_product_show', methods: ['GET'])]
    public function show(Product $product): JsonResponse
    {
        //recup image
        $images = [];
        foreach ($product->getImages() as $image) {
            $images[] = $image->getImagePath();
        }

        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'descriptions' => $product->getDescriptions(),
            'price' => $product->getPrice(),
            'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            'category' => $product->getCategory() ? $product->getCategory()->getName() : null,
            'images' => $images

        ];

        return new JsonResponse($data);
    }

//modifier un produit spécifique

    #[Route('/admin/{id}/edit', name: 'app_product_patch', methods: ['PATCH'])]
    #[IsGranted('ROLE_ADMIN')]
    public function edit(Request $request, Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (isset($data['descriptions'])) {
            $product->setDescriptions($data['descriptions']);
        }
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
        }
        if (isset($data['createdAt'])) {
            $product->setCreatedAt(new \DateTimeImmutable($data['createdAt']));
        }
        if (isset($data['category'])) {
            $category = $entityManager->getRepository(Category::class)->find($data['category']);
            $product->setCategory($category);
        }
        if (isset($data['images'])) {
            // delete
            foreach ($product->getImages() as $image) {
                $entityManager->remove($image);
            }
            $entityManager->flush();
            //add
            foreach ($data['images'] as $imageData) {
                $image = new Images();
                $image->setImagePath($imageData['url']); // ou 'imagePath' si tu changes le nom
                $image->setProductId($product);
                $entityManager->persist($image);
            }
        }
        $entityManager->flush();
        //recup image pour le renvoyer en json
        $images = [];
        foreach ($product->getImages() as $image) {
            $images[] = $image->getImagePath();
        }

        return new JsonResponse([
            'message' => 'Product updated',
            'product' => [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions(),
                'price' => $product->getPrice(),
                'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
                'category' => $product->getCategory() ? $product->getCategory()->getName() : null,
                'images' => $images
            ]
        ], JsonResponse::HTTP_OK);
    }

    //supprimer un produits
    #[Route('/admin/{id}/delete', name: 'app_product_delete', methods: ['POST', 'DELETE'])]
//#[IsGranted('ROLE_ADMIN')]
    public function delete(Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        foreach ($product->getImages() as $image) {
            $entityManager->remove($image);
        }
        $entityManager->remove($product);
        $entityManager->flush();
        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    //filtre
    #[Route('/search', name: 'product_search', methods: ['POST'])]
    public function search(Request $request, ProductRepository $productRepository)
    {
        // Récup json
        $data = json_decode($request->getContent(), true);


        $filtres = [
            'name' => $data['name'] ?? null,
            'category' => $data['category'] ?? null,
        ];

        // grace au reposite chercher
        $products = $productRepository->findByFilters($filtres);

        // donne en format json
        $result = [];
        foreach ($products as $product) {
            $result[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'category' => $product->getCategory() ? $product->getCategory()->getName() : null,
                'price' => $product->getPrice(),
                'created_at' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($result);
    }
}

<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Images;
use App\Entity\Product;
use App\Entity\Stock;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/product')]
final class ProductController extends AbstractController
{
    #[Route(name: 'app_product_index', methods: ['GET'])]
    public function index(ProductRepository $productRepository, EntityManagerInterface $entityManager): Response
    {
        $products = $productRepository->findAll();
        $data = [];

        foreach ($products as $product) {
            $images = [];
            foreach ($product->getImages() as $image) {
                $images[] = $image->getImagePath();
            }

            $stock = $entityManager->getRepository(Stock::class)->findOneBy(['product' => $product]);

            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions(),
                'price' => $product->getPrice(),
                'category' => $product->getCategory()?->getName(),
                'images' => $images,
                'stock' => $stock?->getQuantite() ?? 0,
                'isPromo' => $product->isPromo(),
                'isNew' => $product->isNew(),
                'promoStartDate' => $product->getPromoStart()?->format('Y-m-d H:i:s'),
                'promoEndDate' => $product->getPromoEnd()?->format('Y-m-d H:i:s'),
                'originalPrice' => $product->getOriginalPrice()
            ];
        }

        return $this->json($data);
    }

    #[Route('/admin/new', name: 'app_product_new', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return new JsonResponse(['error' => 'Invalid JSON'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $category = $entityManager->getRepository(Category::class)->find($data['category']);

        $product = new Product();
        $product->setName($data['name']);
        $product->setDescriptions($data['descriptions']);
        $product->setPrice($data['price']);
        $product->setCreatedAt(new \DateTimeImmutable());
        $product->setCategory($category);

        $product->setIsPromo($data['isPromo'] ?? false);
        $product->setIsNew($data['isNew'] ?? false);

        if (!empty($data['promoStartDate'])) {
            $product->setPromoStart(new \DateTimeImmutable($data['promoStartDate']));
        }

        if (!empty($data['promoEndDate'])) {
            $product->setPromoEnd(new \DateTimeImmutable($data['promoEndDate']));
        }

        if (isset($data['originalPrice'])) {
            $product->setOriginalPrice($data['originalPrice']);
        }

        $entityManager->persist($product);

        if (!empty($data['images'])) {
            foreach ($data['images'] as $imageData) {
                $image = new Images();
                $image->setImagePath($imageData['url']);
                $image->setProductId($product);
                $entityManager->persist($image);
                $product->addImage($image);
            }
        }

        $stock = new Stock();
        if (isset($data['stock'])) {
            $stock->setQuantite($data['stock']);
        }
        $stock->setProductId($product);
        $entityManager->persist($stock);

        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Product created',
            'product' => [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions(),
                'price' => $product->getPrice(),
                'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
                'category' => $product->getCategory()->getName(),
                'images' => array_map(fn($img) => ['url' => $img->getImagePath()], $product->getImages()->toArray()),
                'stock' => $stock->getQuantite(),
                'isPromo' => $product->isPromo(),
                'isNew' => $product->isNew(),
                'promoStartDate' => $product->getPromoStart()?->format('Y-m-d H:i:s'),
                'promoEndDate' => $product->getPromoEnd()?->format('Y-m-d H:i:s'),
                'originalPrice' => $product->getOriginalPrice()
            ]
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_product_show', methods: ['GET'])]
    public function show(Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        $images = [];
        foreach ($product->getImages() as $image) {
            $images[] = $image->getImagePath();
        }

        $stock = $entityManager->getRepository(Stock::class)->findOneBy(['product' => $product]);

        return new JsonResponse([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'descriptions' => $product->getDescriptions(),
            'price' => $product->getPrice(),
            'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            'category' => $product->getCategory()?->getName(),
            'images' => $images,
            'stock' => $stock?->getQuantite() ?? 0,
            'isPromo' => $product->isPromo(),
            'isNew' => $product->isNew(),
            'promoStartDate' => $product->getPromoStart()?->format('Y-m-d H:i:s'),
            'promoEndDate' => $product->getPromoEnd()?->format('Y-m-d H:i:s'),
            'originalPrice' => $product->getOriginalPrice()
        ]);
    }

    #[Route('/admin/{id}/edit', name: 'app_product_patch', methods: ['PATCH'])]
    #[IsGranted('ROLE_ADMIN')]
    public function edit(Request $request, Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $product->setName($data['name']);
        if (isset($data['descriptions'])) $product->setDescriptions($data['descriptions']);
        if (isset($data['price'])) $product->setPrice($data['price']);
        if (isset($data['createdAt'])) $product->setCreatedAt(new \DateTimeImmutable($data['createdAt']));
        if (isset($data['category'])) {
            $category = $entityManager->getRepository(Category::class)->find($data['category']);
            $product->setCategory($category);
        }

        if (isset($data['isPromo'])) $product->setIsPromo($data['isPromo']);
        if (isset($data['isNew'])) $product->setIsNew($data['isNew']);
        if (!empty($data['promoStartDate'])) $product->setPromoStart(new \DateTimeImmutable($data['promoStartDate']));
        if (!empty($data['promoEndDate'])) $product->setPromoEnd(new \DateTimeImmutable($data['promoEndDate']));

        if (isset($data['originalPrice'])) {
            $product->setOriginalPrice($data['originalPrice']);
        }

        $stock = $entityManager->getRepository(Stock::class)->findOneBy(['product' => $product]);
        if (isset($data['stock'])) {
            if ($stock) {
                $stock->setQuantite($data['stock']);
            } else {
                $stock = new Stock();
                $stock->setQuantite($data['stock']);
                $stock->setProductId($product);
                $entityManager->persist($stock);
            }
        }

        if (isset($data['images'])) {
            foreach ($product->getImages() as $image) {
                $entityManager->remove($image);
            }
            $entityManager->flush();

            foreach ($data['images'] as $imageData) {
                $image = new Images();
                $image->setImagePath($imageData['url']);
                $image->setProductId($product);
                $entityManager->persist($image);
            }
        }

        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Product updated',
            'product' => [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions(),
                'price' => $product->getPrice(),
                'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
                'category' => $product->getCategory()?->getName(),
                'images' => array_map(fn($img) => $img->getImagePath(), $product->getImages()->toArray()),
                'stock' => $stock?->getQuantite() ?? 0,
                'isPromo' => $product->isPromo(),
                'isNew' => $product->isNew(),
                'promoStartDate' => $product->getPromoStart()?->format('Y-m-d H:i:s'),
                'promoEndDate' => $product->getPromoEnd()?->format('Y-m-d H:i:s'),
                'originalPrice' => $product->getOriginalPrice()
            ]
        ]);
    }

    #[Route('/admin/{id}/delete', name: 'app_product_delete', methods: ['POST', 'DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        foreach ($product->getImages() as $image) {
            $entityManager->remove($image);
        }

        $stock = $entityManager->getRepository(Stock::class)->findOneBy(['product' => $product]);
        if ($stock) {
            $entityManager->remove($stock);
        }

        $entityManager->remove($product);
        $entityManager->flush();

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('/search', name: 'product_search', methods: ['POST'])]
    public function search(Request $request, ProductRepository $productRepository)
    {
        $data = json_decode($request->getContent(), true);
        $filtres = [
            'name' => $data['name'] ?? null,
            'category' => $data['category'] ?? null,
        ];

        $products = $productRepository->findByFilters($filtres);

        $result = [];
        foreach ($products as $product) {
            $result[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'category' => $product->getCategory()?->getName(),
                'price' => $product->getPrice(),
                'created_at' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($result);
    }

#[Route('/{id}/toggle-new', name: 'product_toggle_new', methods: ['PATCH'])]

public function toggleNew(Product $product, EntityManagerInterface $entityManager): JsonResponse
{
    $product->setIsNew(!$product->isNew());
    $entityManager->flush();

    return new JsonResponse([
        'success' => true,
        'isNew' => $product->isNew(),
        'id' => $product->getId(),
    ]);
}

}

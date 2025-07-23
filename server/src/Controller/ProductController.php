<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse; 



#[Route('/product')]
final class ProductController extends AbstractController
{
    #[Route(name: 'app_product_index', methods: ['GET'])]
    // public function index(ProductRepository $productRepository): Response
    // {
    //     return $this->render('product/index.html.twig', [
    //         'products' => $productRepository->findAll(),
    //     ]);
    // }

//afficher tous les produits
    public function index(ProductRepository $productRepository): Response
    {
        $products = $productRepository->findAll();

        $data = [];

        foreach ($products as $product) {
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions(),
                'price' => $product->getPrice(),
                'category' => $product->getCategory() ? $product->getCategory()->getName() : null
            ];
        }

        return $this->json($data);
    }

// cree un nouveau produit
    #[Route('/new', name: 'app_product_new', methods: ['GET', 'POST'])]
    // public function new(Request $request, EntityManagerInterface $entityManager): Response
    // {
    //     $product = new Product();
    //     $form = $this->createForm(ProductType::class, $product);
    //     $form->handleRequest($request);

    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $entityManager->persist($product);
    //         $entityManager->flush();

    //         //mettre le react front ici
    //         return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
    //     }

    //     //mettre le react front ici
    //     return $this->render('product/new.html.twig', [
    //         'product' => $product,
    //         'form' => $form,
    //     ]);
    // }
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
{
    $data = json_decode($request->getContent(), true); 

    // Récup id
    $category = $entityManager->getRepository(Category::class)->find($data['category']);

    $product = new Product();
    $product->setName($data['name']);
    $product->setDescriptions($data['descriptions']);
    $product->setPrice($data['price']);
    $product->setCreatedAt(new \DateTimeImmutable($data['createdAt']));
    $product->setCategory($category);

    $entityManager->persist($product);
    $entityManager->flush();

    return new JsonResponse([
        'message' => 'Product created successfully!',
        'product' => [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'descriptions' => $product->getDescriptions(),
            'price' => $product->getPrice(),
            'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            'category' => $product->getCategory()->getName()
        ]
    ], JsonResponse::HTTP_CREATED);
}   
//voir un produit en detail
    #[Route('/{id}', name: 'app_product_show', methods: ['GET'])]
    // public function show(Product $product): Response
    // {
    //     return $this->render('product/show.html.twig', [
    //         'product' => $product,
    //     ]);
    // }

    public function show(Product $product): JsonResponse
{
    $data = [
        'id' => $product->getId(),
        'name' => $product->getName(),
        'descriptions' => $product->getDescriptions(),
        'price' => $product->getPrice(),
        'createdAt' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
        'category' => $product->getCategory() ? $product->getCategory()->getName() : null,
    ];

    return new JsonResponse($data);
}

    //modifier un produit spécifique
    #[Route('/{id}/edit', name: 'app_product_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    //supprimer un produits
    #[Route('/{id}', name: 'app_product_delete', methods: ['POST'])]
    public function delete(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($product);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_product_index', [], Response::HTTP_SEE_OTHER);
    }
}

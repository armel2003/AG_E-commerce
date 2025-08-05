<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class CartController extends AbstractController
{
    //ajout article 
    #[Route('/cart/{id}', name: 'app_cart', methods: ['POST'])]
    public function index(EntityManagerInterface $entityManager, Product $product): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $cart = $currentUser->getCart();
        if (!$cart) {
            $cart = new Cart();
            $cart->setUser($currentUser);
        }

        try {
            $cart->addProduct($product);
            $entityManager->persist($cart);
            $entityManager->flush();

            return $this->json(['message' => 'Product added to cart'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to add product to cart'], Response::HTTP_BAD_REQUEST);
        }
    }

    //supprimer artcile 
    #[Route('/cart/{id}', name: 'app_cart_delete', methods: ['DELETE'])]
    public function delete(EntityManagerInterface $entityManager, Product $product): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $cart = $currentUser->getCart();
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], Response::HTTP_NOT_FOUND);
        }
        try {
            $cart->removeProduct($product);
            $entityManager->persist($cart);
            $entityManager->flush();
            return $this->json(['message' => 'Product removed from cart'], Response::HTTP_OK);
        }
        catch (\Exception $e) {
            return $this->json(['error' => 'Failed to remove product from cart'], Response::HTTP_BAD_REQUEST);
        }
    }

    //affiche panier 
    #[Route('/cart', name: 'app_cart_show', methods: ['GET'])]
    public function show(EntityManagerInterface $entityManager): JsonResponse
    {
        $currentUser = $this->getUser();
        //var_dump($currentUser);
        if (!$currentUser) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }
        $cart = $currentUser->getCart();
        //$cart = $entityManager->getRepository(Cart::class)->findOneBy(['user' => $currentUser]);
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], Response::HTTP_NOT_FOUND);
        }
        $products = [];
        foreach ($cart->getProducts() as $product) {
            $products[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'descriptions' => $product->getDescriptions()
            ];
        }
        return $this->json($products);
    }
    //vide le panie
    #[Route('/cart/empty', name: 'app_cart_clear', methods: ['DELETE'])]
    public function clear(EntityManagerInterface $entityManager): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $cart = $currentUser->getCart();
        if (!$cart) {
            return $this->json(['error' => 'Cart not found'], Response::HTTP_NOT_FOUND);
        }

        foreach ($cart->getProducts() as $product) {
            $cart->removeProduct($product);
        }
        return $this->json(['message' => 'Cart cleared'], Response::HTTP_OK);
    }
}

<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\Cart;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class OrdersController extends AbstractController
{
    #[Route('/orders', name: 'app_orders_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Vérifier l'utilisateur
        $currentUser = $this->getUser();
        if (!$currentUser) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // Lire le JSON
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'JSON invalide'], Response::HTTP_BAD_REQUEST);
        }

        // cart_id obligatoire
        if (!isset($data['cart_id'])) {
            return $this->json(['error' => 'cart_id est requis'], Response::HTTP_BAD_REQUEST);
        }

        // Récupérer le panier
        $cart = $em->getRepository(Cart::class)->find((int) $data['cart_id']);
        if (!$cart) {
            return $this->json(['error' => 'Panier introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Optionnel: refuser si le panier n’appartient pas à l’utilisateur
        if ($cart->getUser()?->getId() !== $currentUser->getId()) {
            return $this->json(['error' => 'Ce panier ne vous appartient pas'], Response::HTTP_FORBIDDEN);
        }

        // Créer l'Order
        $order = new Order();
        $order->setUser($currentUser);
        $order->setCart($cart);

        // Renseigner les champs (valeurs par défaut si absents)
        // status (int)
        if (isset($data['status'])) {
            $order->setStatus((int) $data['status']);
        }

        // type (string)
        if (isset($data['type']) && is_string($data['type']) && $data['type'] !== '') {
            $order->setType($data['type']);
        }

        // adresse (int nullable)
        if (array_key_exists('adresse', $data)) {
            $order->setAdresse($data['adresse'] === null ? null : (int) $data['adresse']);
        }

        // zipcode / city / country en BIGINT (mappés string côté PHP)
        if (array_key_exists('zipcode', $data)) {
            $order->setZipcode($data['zipcode'] === null ? null : (string) $data['zipcode']);
        }
        if (array_key_exists('city', $data)) {
            $order->setCity($data['city'] === null ? null : (string) $data['city']);
        }
        if (array_key_exists('country', $data)) {
            $order->setCountry($data['country'] === null ? null : (string) $data['country']);
        }

        // createdAt est déjà initialisé dans le constructeur de l’entité

        try {
            $em->persist($order);
            $em->flush();

            return $this->json([
                'id' => $order->getId(),
                'status' => $order->getStatus(),
                'type' => $order->getType(),
                'created_at' => $order->getCreatedAt()?->format(DATE_ATOM),
                'cart_id' => $order->getCart()?->getId(),
                'user_id' => $order->getUser()?->getId(),
                'adresse' => $order->getAdresse(),
                'zipcode' => $order->getZipcode(),
                'city' => $order->getCity(),
                'country' => $order->getCountry(),
            ], Response::HTTP_CREATED);
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Impossible de créer la commande'
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/orders', name: 'app_orders_list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        $currentUser = $this->getUser();
        if (!$currentUser) {
            return $this->json(['error' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        $orders = $em->getRepository(Order::class)->findBy(
            ['user' => $currentUser],
            ['createdAt' => 'DESC']
        );

        $data = [];
        foreach ($orders as $order) {
            $data[] = [
                'id' => $order->getId(),
                'status' => $order->getStatus(),
                'type' => $order->getType(),
                'created_at' => $order->getCreatedAt()?->format(DATE_ATOM),
                'cart_id' => $order->getCart()?->getId(),
                'user_id' => $order->getUser()?->getId(),
                'adresse' => $order->getAdresse(),
                'zipcode' => $order->getZipcode(),
                'city' => $order->getCity(),
                'country' => $order->getCountry(),
            ];
        }

        return $this->json($data, Response::HTTP_OK);
    }
}

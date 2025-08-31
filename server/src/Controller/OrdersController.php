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
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

final class OrdersController extends AbstractController
{
    private function generateCdKey(): string
    {
        // 16 bytes -> 32 hex chars -> format XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX (we'll use 5x5) but typical 4x4 groups
        $bytes = random_bytes(16);
        $hex = strtoupper(bin2hex($bytes));
        // Take 16*2 = 32 chars, format into 4-char groups, total 8 groups -> we will use 4 groups of 4 for brevity
        $groups = str_split(substr($hex, 0, 16), 4);
        return implode('-', $groups);
    }

    #[Route('/orders', name: 'app_orders_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, MailerInterface $mailer): JsonResponse
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

            // Générer une CD Key pour chaque produit du panier
            $items = [];
            $total = 0.0;
            foreach ($cart->getProducts() as $product) {
                $key = $this->generateCdKey();
                $price = (float) $product->getPrice();
                $total += $price;
                $items[] = [
                    'name' => $product->getName(),
                    'price' => $price,
                    'key' => $key,
                ];
            }

            // Construire le contenu de l'email (HTML simple)
            $lines = '';
            foreach ($items as $it) {
                $lines .= sprintf('<li><strong>%s</strong> — %.2f €<br/>CD Key: <code>%s</code></li>',
                    htmlspecialchars($it['name'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
                    $it['price'],
                    htmlspecialchars($it['key'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
                );
            }

            $html = sprintf(
                '<h2>Récapitulatif de votre commande #%d</h2>
                 <p>Merci pour votre achat. Voici le détail de votre commande passée le %s.</p>
                 <ul>%s</ul>
                 <p><strong>Total:</strong> %.2f €</p>
                 <p>Conservez vos clés en lieu sûr. Bon jeu !</p>',
                $order->getId(),
                (new \DateTimeImmutable())->format('d/m/Y H:i'),
                $lines,
                $total
            );

            // Préparer et envoyer l'email
            try {
                // Utiliser l'email fourni dans le formulaire si valide, sinon repli sur l'email utilisateur, puis défaut
                if (isset($data['email']) && is_string($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                    $toEmail = $data['email'];
                } elseif ($currentUser->getEmail()) {
                    $toEmail = $currentUser->getEmail();
                } else {
                    $toEmail = 'test@example.com';
                }

                $emailMsg = (new Email())
                    ->from('no-reply@ecommerce.local')
                    ->to($toEmail)
                    ->subject(sprintf('Votre commande #%d - Récapitulatif et CD keys', $order->getId()))
                    ->html($html);
                $mailer->send($emailMsg);
            } catch (\Throwable $mailEx) {
                // On n'échoue pas la commande si l'envoi email plante; on renvoie un avertissement
            }

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
                'cd_keys_sent' => count($items),
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

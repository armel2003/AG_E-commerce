<?php

namespace App\Controller;

use App\Entity\Promos;
use App\Entity\Product;
use App\Repository\PromosRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/promos')]
final class PromosController extends AbstractController
{
    //tous les promos 
    #[Route('', name: 'promos_index', methods: ['GET'])]
    public function index(PromosRepository $promosRepository): JsonResponse
    {
        $promos = $promosRepository->findAll();

        $data = [];
        foreach ($promos as $promo) {
            $data[] = [
                'id' => $promo->getId(),
                'value' => $promo->getValue(),
                'product' => $promo->getProductId()?->getId(),
                'product_name' => $promo->getProductId()?->getName()
            ];
        }

        return new JsonResponse($data);
    }

    //detail promo 
    #[Route('/show/{id}', name: 'promos_show', methods: ['GET'])]
    public function show(Promos $promo): JsonResponse
    {
        return new JsonResponse([
            'id' => $promo->getId(),
            'value' => $promo->getValue(),
            'product' => $promo->getProductId()?->getId(),
            'product_name' => $promo->getProductId()?->getName()
        ]);
    }

    //create promos 
    #[Route('/create', name: 'promos_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManagerInterface): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['value'], $data['product_id'])) {
            return new JsonResponse(['error' => 'Donné manquante'], 400);
        }

        $value = (float) $data['value'];
        if ($value < 0 || $value > 1) {
            return new JsonResponse(['error' => 'valeur invalidde'], 400);
        }

        $product = $entityManagerInterface->getRepository(Product::class)->find($data['product_id']);
        if (!$product) {
            return new JsonResponse(['error' => 'produit non trouvé'], 404);
        }
        $promo = new Promos();
        $promo->setValue($value);
        $promo->setProductId($product);

        $entityManagerInterface->persist($promo);
        $this->appliquerPromo($promo);

        $entityManagerInterface->flush();

        return new JsonResponse([
            'message' => 'Promo créée',
            'promo' => [
                'id' => $promo->getId(),
                'value' => $promo->getValue(),
                'product' => $product->getId(),
            ]
        ], 201);
    }

    #[Route('/update/{id}', name: 'promos_update', methods: ['PATCH'])]
    public function update(Request $request, Promos $promo, EntityManagerInterface $entityManagerInterface): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['value'])) {
            $value = (float) $data['value'];
            if ($value < 0 || $value > 1) {
                return new JsonResponse(['error' => 'sup à 0 et inf 1'], 400);
            }
            $promo->setValue($value);
        }

        $this->appliquerPromo($promo);

        $entityManagerInterface->flush();

        return new JsonResponse([
            'message' => 'Promo update',
            'promo' => [
                'id' => $promo->getId(),
                'value' => $promo->getValue(),
                'product' => $promo->getProductId()?->getId()
            ]
        ]);
    }

    #[Route('/delete/{id}', name: 'promos_delete', methods: ['DELETE'])]
    public function delete(Promos $promo, EntityManagerInterface $entityManagerInterface): JsonResponse
    {
        // Remettre le prix 
        $this->retirerPromo($promo);

        $entityManagerInterface->remove($promo);
        $entityManagerInterface->flush();

        return new JsonResponse(null, 204);
    }


    private function appliquerPromo(Promos $promo): void
    {
        $product = $promo->getProductId();
        $value = $promo->getValue();

        if ($product->getOriginalPrice() === null) {
            // stocker prix original av la promo
            $product->setOriginalPrice($product->getPrice());
        }

        $original = (float) $product->getOriginalPrice();
        $newPrice = $original * (1 - $value);

        $product->setPrice((string) $newPrice);
        $product->setIsPromo(true);
    }

    private function retirerPromo(Promos $promo): void
    {
        $product = $promo->getProductId();

        if ($product && $product->getOriginalPrice() !== null) {
            //prend l'ancien prix
            $product->setPrice($product->getOriginalPrice());
            $product->setOriginalPrice(null);
            $product->setIsPromo(false);
        }
    }
}

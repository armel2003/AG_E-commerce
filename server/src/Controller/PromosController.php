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
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['value'], $data['product_id'])) {
            return new JsonResponse(['error' => 'Valeur ou produit manquant'], 400);
        }

        $value = (float) $data['value'];
        if ($value < 0 || $value > 1) {
            return new JsonResponse(['error' => 'La réduction doit être comprise entre 0 et 1'], 400);
        }

        $product = $em->getRepository(Product::class)->find($data['product_id']);
        if (!$product) {
            return new JsonResponse(['error' => 'Produit non trouvé'], 404);
        }

        $promo = new Promos();
        $promo->setValue($value);
        $promo->setProductId($product);

        $em->persist($promo);
        $em->flush();

        return new JsonResponse([
            'message' => 'Promo créée',
            'promo' => [
                'id' => $promo->getId(),
                'value' => $promo->getValue(),
                'product' => $product->getId(),
            ]
        ], 201);
    }
    //update promo
    #[Route('/update/{id}', name: 'promos_update', methods: ['PATCH'])]
    public function update(Request $request, Promos $promo, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['value'])) {
            $value = (float) $data['value'];
            if ($value < 0 || $value > 1) {
                return new JsonResponse(['error' => 'La réduction doit être entre 0 et 1'], 400);
            }
            $promo->setValue($value);
        }

        $em->flush();

        return new JsonResponse([
            'message' => 'Promo mise à jour',
            'promo' => [
                'id' => $promo->getId(),
                'value' => $promo->getValue(),
                'product' => $promo->getProductId()?->getId()
            ]
        ]);
    }
    //supprimer promo
    #[Route('/delete/{id}', name: 'promos_delete', methods: ['DELETE'])]
    public function delete(Promos $promo, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($promo);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}

<?php

namespace App\Controller;

use App\Entity\Promos;
use App\Form\PromosType;
use App\Repository\PromosRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/promos')]
final class PromosController extends AbstractController
{
    #[Route(name: 'app_promos_index', methods: ['GET'])]
    public function index(PromosRepository $promosRepository): Response
    {
        return $this->render('promos/index.html.twig', [
            'promos' => $promosRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_promos_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $promo = new Promos();
        $form = $this->createForm(PromosType::class, $promo);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($promo);
            $entityManager->flush();

            return $this->redirectToRoute('app_promos_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('promos/new.html.twig', [
            'promo' => $promo,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_promos_show', methods: ['GET'])]
    public function show(Promos $promo): Response
    {
        return $this->render('promos/show.html.twig', [
            'promo' => $promo,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_promos_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Promos $promo, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(PromosType::class, $promo);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_promos_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('promos/edit.html.twig', [
            'promo' => $promo,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_promos_delete', methods: ['POST'])]
    public function delete(Request $request, Promos $promo, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$promo->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($promo);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_promos_index', [], Response::HTTP_SEE_OTHER);
    }
}

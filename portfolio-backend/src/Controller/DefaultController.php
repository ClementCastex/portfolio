<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_default')]
    public function index(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'Welcome to your portfolio API',
            'status' => 'running'
        ]);
    }
} 
<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SpaController extends AbstractController {
    #[Route("/{reactRouting}", name: "app_home", requirements: ["reactRouting" => "^(?!api).+"], defaults: ["reactRouting" => null])]
    public function index() {
        return $this->render('spa/index.html.twig');
    }
}

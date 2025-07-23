<?php

namespace App\Entity;

use App\Repository\ImagesRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Product;

#[ORM\Entity(repositoryClass: ImagesRepository::class)]
class Images
{
    #[ORM\Id] 
    #[ORM\ManyToOne(inversedBy: 'images')]
    #[ORM\JoinColumn(name : "product_id",nullable: false)]
    private ?Product $product_id = null;

    #[ORM\Column(length: 255)]
    private ?string $image_path = null;

    public function getProductId(): ?Product
    {
        return $this->product_id;
    }

    public function setProductId(?Product $product_id): static
    {
        $this->product_id = $product_id;
        return $this;
    }

    public function getImagePath(): ?string
    {
        return $this->image_path;
    }

    public function setImagePath(string $image_path): static
    {
        $this->image_path = $image_path;
        return $this;
    }
}

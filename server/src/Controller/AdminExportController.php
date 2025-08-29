<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Stock;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class AdminExportController extends AbstractController
{
    #[Route('/admin/export', name: 'admin_export_products', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function export(EntityManagerInterface $em): Response
    {
        $products = $em->getRepository(Product::class)->findAll();

        // Build spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Headers
        $headers = [
            'A1' => 'ID',
            'B1' => 'Name',
            'C1' => 'Description',
            'D1' => 'Price',
            'E1' => 'Original Price',
            'F1' => 'Category',
            'G1' => 'Stock',
            'H1' => 'Is Promo',
            'I1' => 'Is New',
            'J1' => 'Promo Start',
            'K1' => 'Promo End',
            'L1' => 'Created At',
            'M1' => 'Images (URLs)',
        ];
        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        $row = 2;
        foreach ($products as $product) {
            $stock = $em->getRepository(Stock::class)->findOneBy(['product' => $product]);
            $imageUrls = [];
            foreach ($product->getImages() as $img) {
                $imageUrls[] = $img->getImagePath();
            }

            $sheet->setCellValue('A' . $row, $product->getId());
            $sheet->setCellValue('B' . $row, $product->getName());
            $sheet->setCellValue('C' . $row, $product->getDescriptions());
            $sheet->setCellValue('D' . $row, $product->getPrice());
            $sheet->setCellValue('E' . $row, $product->getOriginalPrice());
            $sheet->setCellValue('F' . $row, $product->getCategory()?->getName());
            $sheet->setCellValue('G' . $row, $stock?->getQuantite() ?? 0);
            $sheet->setCellValue('H' . $row, $product->isPromo() ? 'Yes' : 'No');
            $sheet->setCellValue('I' . $row, $product->isNew() ? 'Yes' : 'No');
            $sheet->setCellValue('J' . $row, $product->getPromoStart()?->format('Y-m-d H:i:s'));
            $sheet->setCellValue('K' . $row, $product->getPromoEnd()?->format('Y-m-d H:i:s'));
            $sheet->setCellValue('L' . $row, $product->getCreatedAt()?->format('Y-m-d H:i:s'));
            $sheet->setCellValue('M' . $row, implode(", ", $imageUrls));

            $row++;
        }

        // Auto size columns A-M
        foreach (range('A', 'M') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Stream the file to the browser
        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'export_products_') . '.xlsx';
        $writer->save($tempFile);

        $content = file_get_contents($tempFile);
        @unlink($tempFile);

        $response = new Response($content);
        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment; filename="products_export.xlsx"');
        $response->headers->set('Content-Length', (string) strlen($content));

        return $response;
    }
}

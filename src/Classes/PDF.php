<?php

namespace App\Classes;

use Mpdf\Mpdf;
use App\Entity\Task;
use App\Entity\Project;
use Contao\ArticleModel;
use Contao\ContentModel;
use Mpdf\Config\FontVariables;
use Mpdf\Config\ConfigVariables;
use Symfony\Component\HttpFoundation\Response;
use \ProjectManagementBundle\Utils\SystemUtils;
use Symfony\Component\Routing\Annotation\Route;
use \ProjectManagementBundle\Model\ProjectsModel;
use \ProjectManagementBundle\Classes\ProjectNotifications;
use \ProjectManagementBundle\Classes\ProjectCompatibilityChecker;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PDF {
    private Mpdf $pdf;
    // private ProjectsModel $project;

    public function __construct(private Project $project) {
        $this->pdf = new Mpdf($this->addFonts());
    }

    public function createPdf() {
        $this->buildPDF();

        $this->pdf->Output("{$this->project->getName()}.pdf", 'D');

        return new Response('Ok', 200);
    }

    private function buildPDF() {
        $this->createPageNumbers();
        // $this->injectPhotos();
        // $this->addStylesheet();
        $this->createHeader();
        $this->createFooter();
        $this->setContent();
    }

    private function createPageNumbers() {
        $this->pdf->pagenumPrefix = 'Seite ';
        $this->pdf->pagenumSuffix = '/{nb}';
    }

    // private function injectPhotos() {
    // $this->pdf->showImageErrors = true;
    // $this->pdf->imageVars[''] = file_get_contents(SystemUtils::getUrl() . '/bundles/projectmanagement/styles/assets/img/_logo.svg');
    // $this->pdf->imageVars['expert'] = file_get_contents(SystemUtils::getUrl() . '/bundles/projectmanagement/styles/assets/img/pdf/proven-expert-siegel.svg');
    // $this->pdf->imageVars['contao'] = file_get_contents(SystemUtils::getUrl() . '/bundles/projectmanagement/styles/assets/img/pdf/shopware-und-contao-partner-sw.svg');
    // $this->pdf->imageVars['circle_red'] = file_get_contents(SystemUtils::getUrl() . '/bundles/projectmanagement/styles/assets/img/pdf/circle_red.png');
    // $this->pdf->imageVars['circle_blue'] = file_get_contents(SystemUtils::getUrl() . '/bundles/projectmanagement/styles/assets/img/pdf/circle_blue.png');
    // $this->pdf->imageVars['circle_yellow'] = file_get_contents(SystemUtils::getUrl() . '/bundles/projectmanagement/styles/assets/img/pdf/circle_yellow.png');
    // }

    // private function addStylesheet() {
    //     $stylesheet = file_get_contents(SystemUtils::getUrl() . '/bundles/projectmanagement/styles/dist/pdf.css');
    //     $this->pdf->WriteHTML($stylesheet, \Mpdf\HTMLParserMode::HEADER_CSS);
    // }

    private function setContent() {
        $content = $this->generateProjectInfos();
        $this->pdf->WriteHTML($content, \Mpdf\HTMLParserMode::HTML_BODY);
    }

    private function generateProjectInfos() {
        $text = "";
        $text .= "Tasks count: " . $this->project->getTasks()->count();
        $text .= $this->generateTaskInfos($this->project->getTasks());
        return $text;
    }

    private function generateTaskInfos() {
    }

    private function createHeader() {
        $this->pdf->setAutoTopMargin = 'pad';
        $currentDate = date('j-m-Y');

        $header =
            '<table width="100%">
                <tr>
                    <td ' . self::inlineStyle('width: 50%; vertical-align: top;') . '>
                        <h1 ' . self::inlineStyle('font-size: 44px; line-height: 44px;') . '>Project report</h1>
                        ' . self::tableGap() . '
                        <h3>' . $this->project->getName() . '</h3>
                        </td>
                    <td ' . self::inlineStyle('width: 50%; vertical-align: top;') . '>
                        <img height="45px" src="var:">
                    </td>
                </tr>
                    <tr><td></td></tr>
                    <tr><td></td></tr>
                <tr>
                    
                    <td ' . self::inlineStyle('text-align: right; width: 50%; font-size: 18px; vertical-align: bottom;') . '>
                    <table width="100%">
                        <tr>
                            <td ' . self::inlineStyle('text-align: left; width: 50%;') . '>Export date:' . $currentDate . '</td>
                            <td ' . self::inlineStyle('text-align: right; width: 50%;') . '>{PAGENO}</td>
                        </tr>
                    </table>
                    </td>
                </tr>
                <tr>
                    <td ' . self::inlineStyle('border-bottom: 1px solid lightgrey; width: 85%;') . '></td>
                    <td ' . self::inlineStyle('border-bottom: 2px solid black; width: 15%;') . '></td>
                </tr>
            </table>';

        $this->pdf->setHtmlHeader($header);
    }

    private function createFooter() {
        $this->pdf->setAutoBottomMargin = 'pad';

        $textAlign = 'left';
        $fontSize = 10;

        $styles = self::inlineStyle("text-align: {$textAlign}; font-size: {$fontSize}; font-weight: 300; line-height: 16px");
        $imgStyles = self::inlineStyle('height: 95px');
        $footer = "<table width='100%'>
                    <tr>
                        <td width='28%' {$styles}>
                            <b> Digital- & Filmagentur</b><br>
                            Inhabergeführt von Christoph Voigt<br>
                            Bachelor of Engineering<br>
                            Freiberuflicher Designer<br><br><br><br>
                        </td>
                        <td width='22%' {$styles}>
                            Eibenberger Straße 25a,<br>
                            09235 Burkhardtsdorf<br>
                            Telefon 03721 33 99 20<br>
                            E-Mail kontakt@.de<br><br><br><br>
                        </td>
                        <td width='16%' {$styles}>
                            UST-IDNR<br>
                            DE815394632<br>
                            Steuernummer<br>
                            224/284/01372<br><br><br><br>
                        </td>
                        <td width='34%' align='right'>
                            <table>
                                <tr " . self::inlineStyle('text-align:right') . ">
                                    <td>
                                        <img src='var:contao' {$imgStyles}>
                                    </td>
                                    <td>
                                        <img src='var:expert' {$imgStyles}>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>";

        $this->pdf->setHTMLFooter($footer);
    }

    private function addFonts(): array {
        $defaultConfig = (new ConfigVariables())->getDefaults();
        $fontDirs = $defaultConfig['fontDir'];

        $defaultFontConfig = (new FontVariables())->getDefaults();
        $fontData = $defaultFontConfig['fontdata'];

        return [
            // 'fontDir' => array_merge($fontDirs, [
            //     // SystemUtils::getUrl() . '/bundles/projectmanagement/styles/poppins',
            // ]),
            'fontdata' => $fontData + [
                'Open Sans' => [
                    'R' => 'open-sans-v35-latin-regular.ttf',
                    'I' => 'open-sans-v35-latin-regular.ttf',
                ],
            ],
            'default_font' => 'Open Sans',
            'margBuffer' => 170,
        ];
    }

    private static function inlineStyle($styles) {
        return "style='{$styles}'";
    }

    private static function tableGap() {
        return '<table><tr><td></td></tr></table>';
    }
}

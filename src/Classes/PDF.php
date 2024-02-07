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
        $text = "<h3>Project manager: " . $this->project->getManager()->getFullName() . '</h3>';
        $text .= '<p>Project state: ' . $this->project->getProjectState()->getName() .  '</p><br/>';
        $text .= $this->generateTaskInfos();
        return $text;
    }

    private function generateTaskInfos(): string {

        $text = "Tasks count: " . $this->project->getTasks()->count();
        $tasks = $this->project->getTasks()->toArray();
        $tasksTexts = array_map([__CLASS__, "generateTaskInfo"], $tasks, array_keys($tasks));
        $text .= implode($tasksTexts);
        // $text .= $this->project->getTasks();
        return $text;
    }

    private function generateTaskInfo(Task $task, int $index): string {
        $index++;
        $text = "<span><h4 " . self::inlineStyle('display: inline; float:left;') . ">$index.{$task->getName()}</h4></span>";
        $assignedToTask = $task->getAssignedTo();
        $text .=
            $task->isCompleted() ?
            "  <span " . self::inlineStyle('display: inline; float:left; padding: 4px 4px; background-color: #808080; color: white;') . ">At work</span>" :
            "  <span " . self::inlineStyle('display: inline; float:left; padding: 4px 4px; background-color: #7DCD85; color: black') . ">Done</span>";
        $text .= "<span><h5>Laborer: </h5>" . ($assignedToTask ? $task->getAssignedTo()?->getFullName() . "({$task->getAssignedTo()->getEmail()})" : "No one assigned to task") . "</span>";
        return $text;
    }

    private function createHeader() {
        $this->pdf->setAutoTopMargin = 'pad';
        $currentDate = date('j-m-Y');

        $header =
            '<table width="100%">
                <tr>
                    <td ' . self::inlineStyle('width: 100%; vertical-align: top;') . '>
                        <h1 ' . self::inlineStyle('font-size: 34px; line-height: 34px;') . '>' . $this->project->getName() . '</h1>
                        ' . self::tableGap() . '
                        </td>
                </tr>
                    <tr><td></td></tr>
                    <tr><td></td></tr>
                <tr>
                    <td ' . self::inlineStyle('text-align: right; width: 50%; font-size: 18px; vertical-align: bottom;') . '>
                    <table width="100%">
                        <tr>
                            <td ' . self::inlineStyle('text-align: left; width: 50%;') . '><p>Date: ' . $currentDate . '</p></td>
                            <td ' . self::inlineStyle('text-align: right; width: 50%;') . '><p>{PAGENO}</p></td>
                        </tr>
                    </table>
                    </td>
                </tr>
                <tr>
                    <td ' . self::inlineStyle('border-bottom: 1px solid lightgrey; width: 85%;') . '></td>
                </tr>
            </table>';

        $this->pdf->setHtmlHeader($header);
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

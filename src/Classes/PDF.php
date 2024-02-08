<?php

namespace App\Classes;

use Mpdf\Mpdf;
use App\Entity\Note;
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
        $this->createHeader();
        $this->setContent();
    }

    private function createPageNumbers() {
        $this->pdf->pagenumPrefix = 'Page ';
        $this->pdf->pagenumSuffix = '/{nb}';
    }

    private function setContent() {
        $content = $this->generateProjectInfos();
        $this->pdf->WriteHTML($content, \Mpdf\HTMLParserMode::HTML_BODY);
    }

    private function generateProjectInfos() {
        $text = "<h3>Project manager: " . $this->project->getManager()->getFullName() . '</h3>';

        $tableInfo = new TableBuilder(2, [50, 50], "margin:0");
        if ($this->project->getWebsite()) {
            $tableInfo->insertColumn("Website: ");
            $tableInfo->insertColumn($this->project->getWebsite()->getDomain());
        }
        $tableInfo->insertColumn("Start date: ");
        $tableInfo->insertColumn("{$this->project->getStartDate()->format("Y-m-d")}");
        $tableInfo->insertColumn("End date: ");
        $tableInfo->insertColumn("{$this->project->getEndDate()->format("Y-m-d")}");
        $tableInfo->insertColumn("Project state:");
        $tableInfo->insertColumn($this->project->getProjectState()?->getName() ?? "None");
        $tableInfo->insertColumn("Tasks count:");
        $tableInfo->insertColumn($this->project->getTasks()->count());

        $text .= $tableInfo->print();
        $text .= $this->generateTaskInfos();

        if ($this->project->getNotes()->count()) {
            $text .= "<h4>Notes</h4>";
            $text .= $this->generateNotes();
        }
        return $text;
    }

    private function generateNotes() {
        $notes = $this->project->getNotes();
        $notesTable = new TableBuilder(3, [20, 20, 60]);
        $notesTable->insertHead(["Person", "Date", "Message"]);

        foreach ($notes as $note) {
            $notesTable->insertColumn($note->getUser()->getFullName());
            $notesTable->insertColumn($note->getCreatedAt()->format("Y-m-d"));
            $notesTable->insertColumn($note->getText());
        }
        return $notesTable->print();
    }

    private function generateTaskInfos(): string {

        $text = "<h3 style='margin-top: 40px'>Tasks:</h3> ";
        $tasks = $this->project->getTasks()->toArray();
        $tasksTexts = array_map([__CLASS__, "generateTaskInfo"], $tasks, array_keys($tasks));
        $text .= implode($tasksTexts);
        // $text .= $this->project->getTasks();
        return $text;
    }

    private function generateTaskInfo(Task $task, int $index): string {
        $index++;

        $tableHeader = new TableBuilder(3, [70, 10, 20]);

        $tableTaskName = new TableBuilder(3, ["*", "*", "30"], "");

        $tableTaskName->insertColumn("<h4>$index. {$task->getName()}</h4>");
        $tableTaskName->insertColumn($task->isCompleted() ?
            "  <div style='padding: 4px; background-color: #7DCD85; color: black'> Done </div>" :
            "  <div style='padding: 4px; background-color: #808080; color: white;'> At work </div>");
        $tableTaskName->insertColumn("");


        $tableDate = new TableBuilder(2, [50, 50]);
        $tableDate->insertColumn("<span style='max-width:min-content;text-align:right;font-size: 10'>Start date: </span>");
        $tableDate->insertColumn("<span style='max-width:min-content;text-align:right;font-size: 10'>{$task->getStartDate()->format("Y-m-d")}</span>");
        $tableDate->insertColumn("<span style='max-width:min-content;text-align:right;font-size: 10'>End date: </span>");
        $tableDate->insertColumn("<span style='max-width:min-content;text-align:right;font-size: 10'>{$task->getEndDate()->format("Y-m-d")}</span>");

        $tableHeader->insertColumn($tableTaskName->print());
        $tableHeader->insertColumn("");
        $tableHeader->insertColumn($tableDate->print());

        $tableLaborer = new TableBuilder(3, [8, 43, 49]);

        $assignedToTask = $task->getAssignedTo();
        $tableLaborer->insertColumn("<h5>Laborer: </h5>");
        $tableLaborer->insertColumn(($assignedToTask ? $task->getAssignedTo()?->getFullName() . " - {$task->getAssignedTo()?->getEmail()}" : "No one assigned to task") . "");
        $tableLaborer->insertColumn("");

        $text = $tableHeader->print() . $tableLaborer->print();

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

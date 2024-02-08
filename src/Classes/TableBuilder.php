<?php

namespace App\Classes;

use Error;

class TableBuilder {

    private string $table;
    private int $currentColumn = 0;

    public function __construct(
        private int $cols,
        private array $columnsWidth,
        ?string $tableStyles = null
    ) {
        if ($cols == 0) {
            throw new Error("Not enought columns");
        }

        if (count($columnsWidth) < $cols) {
            return new Error("Widths are not equal to columns count");
        }

        if ($tableStyles) {
            $this->table = "<table style='{$tableStyles}'>";
        } else {
            $this->table = "<table style='width:100%;'>";
        }

        $this->currentColumn = $cols;
    }

    public function print() {
        if (str_contains($this->table, "<tbody>")) {
            $this->table .= "</tbody>";
        }

        if (!str_ends_with($this->table, "</tr>")) {
            $this->table .= "</tr>";
        }

        return $this->table . "</table>";
    }

    public function insertHead(array $titles) {
        $this->table .= "<thead style='border-bottom: 1px solid lightgrey;'><tr>";

        $titles = array_map(function (string $title) {
            return "<td style='margin:0;padding:0;'>{$title}</td>";
        }, $titles);

        $this->table .= implode("", $titles) . "</tr></thead><tbody>";
    }

    public function insertColumn(string $content) {
        $this->openRow();

        if ($this->currentColumn >= 1) {
            $currentColumnWidth = $this->columnsWidth[$this->cols - $this->currentColumn];
            $columnStyles = $currentColumnWidth == "*" ? "white-space:no-wrap;width:max-content;" : "width:" . $currentColumnWidth . "%;";
            $this->table .= "<td " . ($currentColumnWidth == "*" ? "nowrap='nowrap'" : "") . " style='{$columnStyles}margin:0;padding:0;'>" . $content . "</td>";
        }

        if ($this->currentColumn == 1) {
            $this->table .= "</tr>";
        }

        $this->currentColumn -= 1;
        $this->resetCols();
    }

    public function setColumnsWidth(array $columnsWidth) {
        $this->columnsWidth = $columnsWidth;
    }

    private function openRow() {
        if ($this->currentColumn == $this->cols) {
            $this->table .= "<tr>";
        }
    }
    private function resetCols() {
        if ($this->currentColumn == 0) {
            $this->currentColumn = $this->cols;
        }
    }
}

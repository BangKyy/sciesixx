<?php
function implodeAssoc($assoc, $sparator=",", $sparatorArrow="=>", $sqlMode=false) {
    $output = [];
    foreach ($assoc as $key => $value) {
        $temp = "$key" . "$sparatorArrow";
        $temp .= $sqlMode ? "'$value'" : "$value";
        array_push($output, $temp);
    }
    return implode($sparator, $output);
}
?>
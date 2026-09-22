<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('notes.editor');
});

Route::get('/notes/demo', function () {
    return view('notes.editor');
});

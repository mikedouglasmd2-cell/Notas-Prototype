@extends('layouts.notas')

@section('content')
    <main class="notas-editor-page min-h-screen bg-slate-100 px-3 pb-10 pt-3 dark:bg-slate-950 sm:px-4 lg:px-6">
        <div data-note-editor-header class="sticky top-3 z-30 isolate mx-auto max-w-5xl"></div>
        <div data-note-editor-body class="mx-auto max-w-5xl pb-6"></div>
        <div data-note-editor-toolbar></div>
    </main>
@endsection

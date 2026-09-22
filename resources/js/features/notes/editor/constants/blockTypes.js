export const NOTE_BLOCK_TYPES = [
    { group: 'Text', items: [
        { key: 'paragraph', label: 'Paragraph' },
        { key: 'heading-1', label: 'Heading 1' },
        { key: 'heading-2', label: 'Heading 2' },
        { key: 'heading-3', label: 'Heading 3' },
    ] },
    { group: 'Lists', items: [
        { key: 'bullet-list', label: 'Bullet list' },
        { key: 'numbered-list', label: 'Numbered list' },
        { key: 'checklist', label: 'Checklist' },
    ] },
    { group: 'Special', items: [
        { key: 'quote', label: 'Quote' },
        { key: 'code', label: 'Code block' },
        { key: 'image', label: 'Image' },
        { key: 'drawing', label: 'Drawing / Sketch' },
    ] },
];

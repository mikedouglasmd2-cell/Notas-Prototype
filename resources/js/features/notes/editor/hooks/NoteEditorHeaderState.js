export function createNoteEditorHeaderState(initialConfig = {}) {
    const state = {
        title: initialConfig.title ?? 'Untitled note',
        mode: initialConfig.mode ?? 'write',
        saveStatus: initialConfig.saveStatus ?? 'saved',
        breadcrumbs: initialConfig.breadcrumbs ?? [],
        isEditingTitle: false,
        draftTitle: initialConfig.title ?? 'Untitled note',
        activeMenu: null,
        selectedDirectory: null,
    };

    const beginTitleEdit = () => {
        if (state.mode !== 'write') {
            return;
        }

        state.draftTitle = state.title;
        state.isEditingTitle = true;
    };

    const updateDraftTitle = (nextValue) => {
        state.draftTitle = nextValue;
    };

    const cancelTitleEdit = () => {
        state.draftTitle = state.title;
        state.isEditingTitle = false;
    };

    const commitTitle = ({ onTitleCommit, onTitleChange }) => {
        const nextValue = state.draftTitle.trim() || state.title;

        state.title = nextValue;
        state.draftTitle = nextValue;
        state.isEditingTitle = false;

        if (typeof onTitleChange === 'function') {
            onTitleChange(nextValue);
        }

        if (typeof onTitleCommit === 'function') {
            onTitleCommit(nextValue);
        }
    };

    const setMode = (nextMode, onModeChange) => {
        const safeMode = nextMode === 'read' ? 'read' : 'write';
        state.mode = safeMode;

        if (typeof onModeChange === 'function') {
            onModeChange(safeMode);
        }
    };

    const toggleMenu = (menuKey) => {
        state.activeMenu = state.activeMenu === menuKey ? null : menuKey;
    };

    const closeMenus = () => {
        state.activeMenu = null;
    };

    const openMoveDialog = () => {
        state.activeMenu = null;
        state.moveDialogOpen = true;
    };

    const closeMoveDialog = () => {
        state.moveDialogOpen = false;
    };

    return {
        state,
        beginTitleEdit,
        updateDraftTitle,
        cancelTitleEdit,
        commitTitle,
        setMode,
        toggleMenu,
        closeMenus,
        openMoveDialog,
        closeMoveDialog,
    };
}

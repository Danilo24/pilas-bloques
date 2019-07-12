import Ember from 'ember';

/// Este service va recibiendo los Ids de los bloques que se ejecutan y SOLAMENTE se encarga del highlighting.
/// Particularmente, tiene la lógica de highligh para los procedimientos.
/// No sabe nada sobre qué hacen o cuándo se ejecutará cada bloque.
export default Ember.Service.extend({
    
    blocks: [],

    step(blockId) {
        let block = this._workspace().getBlockById(blockId)
        if (!block) {
            console.warn(`Couldn't highlight block id: ${blockId}`)
            return
        }
        this._removeLastBlockIfEndOfModule()
        this._removePreviousBlockIfContinue(block)

        if (!this._ignore(block))
          this.blocks.push(block)

        this._updateHighlight()
    },

    clear() {
        this.blocks.length = 0
        this._clearHighlight()
    },
    
    _lastBlock() {
        return this.blocks[this.blocks.length - 1]
    },

    _removeLastBlockIfEndOfModule() {
        if (this._shouldRemoveLastBlock())
          this.blocks.pop()
    },

    _removePreviousBlockIfContinue(block) {
        if (block.getParent() == this._lastBlock())
          this.blocks.pop()
    },

    _ignore(block) {
        return this._isModuleDefinition(block)
    },

    _shouldRemoveLastBlock() {
        return  this._lastBlock() && 
                this._isEndOfModule(this._lastBlock()) && 
                !this._isProcedureCall(this._lastBlock())
    },

    _isEndOfModule(block) {
        return !block.getNextBlock()
    },

    _isModuleDefinition(block) {
        return !block.getParent()
    },

    _isProcedureCall(block) {
        return !!block.defType_
    },

    _updateHighlight() {
        this._clearHighlight()
        this.blocks.forEach((b) => this._workspace().highlightBlock(b.id, true))
    },

    _clearHighlight() {
        this._workspace().highlightBlock()
    },

    _workspace() {
        return Blockly.getMainWorkspace()
    }
})
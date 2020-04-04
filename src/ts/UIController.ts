import elements from './elements'

export const updateScore = (score) => {
    elements.scoreField.textContent = score
}

export const setDimension = (h:number, w: number) => {
    elements.canvas.setAttribute('height', h.toString())
    elements.canvas.setAttribute('width', w.toString())
}
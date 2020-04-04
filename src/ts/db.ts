export const setValue = (key:string, value: string) => {
    localStorage.setItem(key, value);
}

export const getValue = (key: string): string => {
    return localStorage.getItem(key)
}

const HIGH_SCORE = 'high-score'
export const getHighScore = ():number => {
    return parseInt(getValue(HIGH_SCORE))
}

export const setHighScore = (score: number) => {
    setValue(HIGH_SCORE, score.toString())
}
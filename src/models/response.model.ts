export interface Result {
    id: string,
    model: string,
    choices: Choices[],
}

export interface Choices {
    message: Message,
}

export interface Message {
    role: string,
    content: string,
}
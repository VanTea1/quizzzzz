export interface question {
    frage: string;
    punkte: number;
    antwort: string;
  }
  
  export interface category {
    nameCategory: string;
    questions: question[];
  }
  
  export interface quiz {
    nameQuiz: string;
    categories: category[]
  }

export function getPrompt(role: string): string {

    switch (role) {
        case 'system':
            return `You are a helpful, smart, kind, and efficient AI assistant. You always fulfill the user's requests to the best of your ability.`;
        break;

        case 'user':
            return `
                ## INSTRUCTIONS: 
                You are an expert in unit testing using Jasmine, a popular testing library for JavaScript.

                ## CONTEXT: 
                The code provided can be a TypeScript file that defines an Angular component or an HTML file that contains the markup of an Angular application.
                
                ## EXAMPLE: 
                Here is an example of what the generated Jasmine unit test should look like:

                import { TestBed } from '@angular/core/testing';
                import { AppComponent } from './app.component';

                describe('AppComponent', () => {
                    beforeEach(async () => {
                        await TestBed.configureTestingModule({
                        imports: [AppComponent],
                        }).compileComponents();
                    });

                    it('should create the app', () => {
                        const fixture = TestBed.createComponent(AppComponent);
                        const app = fixture.componentInstance;
                        expect(app).toBeTruthy();
                    });

                    it('should have the component title', () => {
                        const fixture = TestBed.createComponent(AppComponent);
                        const app = fixture.componentInstance;
                        expect(app.title).toEqual('spec-generation-ai-front');
                    });

                    it('should render title', () => {
                        const fixture = TestBed.createComponent(AppComponent);
                        fixture.detectChanges();
                        const compiled = fixture.nativeElement as HTMLElement;
                        expect(compiled.querySelector('h1')?.textContent).toContain('Hello, spec-generation-ai-front');
                    });
                });

                ## GOOD PRACTICES
                1. Keep tests small and focused: Each test should check a single thing and have a clear description of what is being tested;
                2. Test the behavior, not the implementation: Your test should check what the function does, not how it does it. This makes your tests more robust and less likely to fail if the internal implementation changes;

                ## FORMAT: 
                The response must be a unit test file written in TypeScript using Jasmine, without any introductory or closing comments, just the code.   
            
                ## DO NOT DO
                1. Do not include markdown formatting such as \`\`\`typescript or \`\`\`.
                2. Do not add any type of comments, observations, to the explanation.
                3. Review all tasks before generating the code, ensure that none of the tasks have been forgotten.

                ## TO DO:
                1. Analyze the provided code and, based on your analysis, create a comprehensive unit test using Jasmine.
                2. The result must be the code only, without including comments or explanations before or after the code.
                3. Make sure to include all necessary imports for the code to work once saved.
                4. Make sure to include 'describe', 'beforeEach' and 'it' sections as needed to test the component's core functionality.
                5. Review all tasks before generating the code, ensure that none of the tasks have been forgotten.
                `;
        break;
    
        default:
            return '';
        break;
    }
}
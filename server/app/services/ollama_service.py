import ollama
from typing import Dict, Any
import json
import os

class OllamaService:
    def __init__(self):
        self.model = os.getenv("OLLAMA_MODEL", "qwen3-coder:480b-cloud")
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    async def generate_website(self, prompt: str, template: str = None, style: str = "modern", industry: str = None) -> Dict[str, str]:
        """
        Generate a website using Ollama based on the user's prompt.
        
        Args:
            prompt: User's description of the website
            template: Optional template name to use as a base
            style: Style preference (modern, minimal, corporate, etc.)
            industry: Industry/category for the website
        
        Returns:
            Dictionary with html, css, js, and content keys
        """
        system_prompt = self._build_system_prompt(template, style, industry)
        
        try:
            response = ollama.chat(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Generate a website based on this description: {prompt}"}
                ],
                options={
                    "temperature": 0.7,
                    "num_predict": 4000
                }
            )
            
            content = response["message"]["content"]
            
            # Parse the response to extract HTML, CSS, JS
            return self._parse_response(content)
            
        except Exception as e:
            raise Exception(f"Error generating website with Ollama: {str(e)}")
    
    def _build_system_prompt(self, template: str = None, style: str = "modern", industry: str = None) -> str:
        """Build the system prompt for Ollama."""
        prompt = """You are an expert web developer and designer. Generate complete, modern, and responsive websites based on user descriptions.

Your output must be a valid JSON object with these exact keys:
- html: Complete HTML5 structure with semantic elements
- css: Complete CSS styling (responsive, modern, following the style preference)
- js: JavaScript for interactivity (minimal but functional)
- content: Brief description of the generated content

Requirements:
1. Use semantic HTML5 elements (header, nav, main, section, footer, etc.)
2. CSS should be mobile-first and responsive
3. Include proper meta tags and viewport settings
4. Use modern CSS features (flexbox, grid, CSS variables)
5. JavaScript should be vanilla and lightweight
6. Ensure accessibility (ARIA labels, proper contrast, etc.)
7. Include placeholder images using placeholder services like placehold.co

"""
        
        if template:
            prompt += f"\nTemplate: Use the {template} as a starting point and customize it.\n"
        
        if style:
            prompt += f"\nStyle preference: {style}\n"
        
        if industry:
            prompt += f"\nIndustry: {industry}\n"
        
        prompt += "\nReturn ONLY the JSON object, no additional text or explanations."
        
        return prompt
    
    def _parse_response(self, content: str) -> Dict[str, str]:
        """Parse the Ollama response to extract HTML, CSS, JS."""
        try:
            # Try to parse as JSON
            result = json.loads(content)
            
            # Validate required keys
            required_keys = ["html", "css", "js", "content"]
            for key in required_keys:
                if key not in result:
                    raise ValueError(f"Missing required key: {key}")
            
            return result
        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract code blocks
            return self._extract_code_blocks(content)
    
    def _extract_code_blocks(self, content: str) -> Dict[str, str]:
        """Extract HTML, CSS, JS from code blocks if JSON parsing fails."""
        result = {
            "html": "",
            "css": "",
            "js": "",
            "content": "Generated from code blocks"
        }
        
        # Extract HTML
        if "```html" in content:
            html_start = content.find("```html") + 7
            html_end = content.find("```", html_start)
            result["html"] = content[html_start:html_end].strip()
        
        # Extract CSS
        if "```css" in content:
            css_start = content.find("```css") + 6
            css_end = content.find("```", css_start)
            result["css"] = content[css_start:css_end].strip()
        
        # Extract JS
        if "```javascript" in content:
            js_start = content.find("```javascript") + 13
            js_end = content.find("```", js_start)
            result["js"] = content[js_start:js_end].strip()
        elif "```js" in content:
            js_start = content.find("```js") + 5
            js_end = content.find("```", js_start)
            result["js"] = content[js_start:js_end].strip()
        
        return result
    
    async def check_connection(self) -> bool:
        """Check if Ollama is accessible."""
        try:
            ollama.list()
            return True
        except Exception:
            return False

ollama_service = OllamaService()

import os

# Create the directory
os.makedirs("projectfiles", exist_ok=True)

# Define the tech stack content
tech_stack_content = """# Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- PostCSS
- Radix UI
- Lucide Icons
- Class Variance Authority (CVA)
- FastAPI
- Uvicorn
"""

# Create and write to the tech stack file
with open("projectfiles/tech stack.md", "w") as file:
    file.write(tech_stack_content)
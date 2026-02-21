---
trigger: always_on
---

This is the color theme :

 
Role,Tailwind Class,Approx. Hex,Usage
Primary (Saffron),bg-orange-800,#9a3412,"Main Header, Primary Brand Color"
Secondary (Vermilion),text-red-900 / bg-red-800,#7f1d1d / #991b1b,"Icons, Event Highlights, Deep Accents"
Accent (Marigold),bg-yellow-500 / text-yellow-400,#eab308 / #facc15,"Buttons, Active States, Halos, Borders"
Background (Parchment),bg-orange-50,#fff7ed,Main Page Background (Warm White)
Text (Stone),text-stone-800,#292524,Main Body Text (Soft Black)
Footer (Earth),bg-orange-950,#431407,Footer Background




This is Typography Theme : 

The design mixes Serif (Classic/Historical) with Sans-Serif (Modern/Digital).

Headings (Serif):

Font Stack: font-serif (Georgia, Cambria, Times New Roman, serif)

Usage: Logo ("Projenitor"), Section Titles ("Our Heritage", "Community Board").

Reason: Evokes the feeling of the physical 305-page ancestral book and history.

Body (Sans-Serif):

Font Stack: font-sans (Inter, Roboto, Segoe UI, sans-serif)

Usage: Navigation, Search Results, Data tables, Buttons.



CSS Variables for Copying : 



:root {
  /* Color Palette */
  --color-primary-saffron: #9a3412;  /* bg-orange-800 */
  --color-secondary-vermilion: #991b1b; /* bg-red-800 */
  --color-accent-marigold: #eab308;   /* bg-yellow-500 */
  --color-highlight-gold: #facc15;    /* text-yellow-400 */
  
  --color-bg-parchment: #fff7ed;      /* bg-orange-50 */
  --color-bg-paper: #ffffff;          /* bg-white */
  --color-bg-footer: #431407;         /* bg-orange-950 */
  
  --color-text-main: #292524;         /* text-stone-800 */
  --color-text-muted: #78716c;        /* text-stone-500 */

  /* Typography */
  --font-heading: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-body: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}












Reason: Ensures high readability for digital data (names, blood groups, phone numbers).
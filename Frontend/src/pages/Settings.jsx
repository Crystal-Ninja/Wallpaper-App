import { useTheme } from "../context/ThemeContext.jsx";
import { Palette, Check, Moon, Sun, Sparkles } from "lucide-react";

const themes = [
  { name: "light", icon: "☀️", desc: "Clean & Bright", category: "Basic" },
  { name: "dark", icon: "🌙", desc: "Easy on Eyes", category: "Basic" },
  { name: "cupcake", icon: "🧁", desc: "Sweet & Soft", category: "Cute" },
  { name: "bumblebee", icon: "🐝", desc: "Yellow Vibes", category: "Bright" },
  { name: "emerald", icon: "💚", desc: "Nature Green", category: "Nature" },
  { name: "corporate", icon: "💼", desc: "Professional", category: "Business" },
  { name: "synthwave", icon: "🌆", desc: "Retro Neon", category: "Retro" },
  { name: "retro", icon: "📻", desc: "Vintage Feel", category: "Retro" },
  { name: "cyberpunk", icon: "🤖", desc: "Future Tech", category: "Tech" },
  { name: "valentine", icon: "💖", desc: "Romantic Pink", category: "Cute" },
  { name: "halloween", icon: "🎃", desc: "Spooky Vibes", category: "Fun" },
  { name: "garden", icon: "🌸", desc: "Fresh Garden", category: "Nature" },
  { name: "forest", icon: "🌲", desc: "Deep Woods", category: "Nature" },
  { name: "aqua", icon: "🌊", desc: "Ocean Blue", category: "Cool" },
  { name: "lofi", icon: "🎧", desc: "Chill Mood", category: "Calm" },
  { name: "pastel", icon: "🌈", desc: "Soft Colors", category: "Cute" },
  { name: "fantasy", icon: "🦄", desc: "Magic Vibes", category: "Fun" },
  { name: "wireframe", icon: "📐", desc: "Minimal Lines", category: "Minimal" },
  { name: "black", icon: "⚫", desc: "Pure Black", category: "Dark" },
  { name: "luxury", icon: "💎", desc: "Premium Gold", category: "Elegant" },
  { name: "dracula", icon: "🧛", desc: "Gothic Dark", category: "Dark" },
  { name: "cmyk", icon: "🎨", desc: "Print Colors", category: "Tech" },
  { name: "autumn", icon: "🍂", desc: "Fall Warmth", category: "Nature" },
  { name: "business", icon: "🏢", desc: "Office Ready", category: "Business" },
  { name: "acid", icon: "⚡", desc: "Electric Lime", category: "Bright" },
  { name: "lemonade", icon: "🍋", desc: "Citrus Fresh", category: "Bright" },
  { name: "night", icon: "🌃", desc: "Midnight Blue", category: "Dark" },
  { name: "coffee", icon: "☕", desc: "Warm Brown", category: "Warm" },
  { name: "winter", icon: "❄️", desc: "Cool White", category: "Cool" }
];

const categories = [...new Set(themes.map(t => t.category))];

export default function Settings() {
  const { theme, changeTheme } = useTheme();

  return (
    <div className="min-h-screen bg-base-100 p-4 ml-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="text-primary" size={32} />
            <h1 className="text-4xl font-bold text-base-content">Theme Settings</h1>
          </div>
          <p className="text-base-content/70 text-lg">
            Personalize your wallpaper app with beautiful themes
          </p>
        </div>

        {/* Current Theme Display */}
        <div className="card bg-base-200 shadow-xl mb-8">
          <div className="card-body text-center">
            <h2 className="card-title justify-center text-2xl mb-2">
              Currently Active: {themes.find(t => t.name === theme)?.icon} {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </h2>
            <p className="text-base-content/70">
              {themes.find(t => t.name === theme)?.desc}
            </p>
          </div>
        </div>

        {/* Theme Categories */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-2xl font-semibold text-base-content mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              {category}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {themes
                .filter(t => t.category === category)
                .map((themeOption) => (
                <div
                  key={themeOption.name}
                  className={`card bg-base-200 hover:bg-base-300 cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
                    theme === themeOption.name ? 'border-primary shadow-lg' : 'border-transparent'
                  }`}
                  onClick={() => changeTheme(themeOption.name)}
                >
                  <div className="card-body p-4 text-center">
                    {/* Theme Icon */}
                    <div className="text-3xl mb-2">
                      {themeOption.icon}
                    </div>
                    
                    {/* Theme Name */}
                    <h4 className="font-semibold text-base-content capitalize flex items-center justify-center gap-2">
                      {themeOption.name}
                      {theme === themeOption.name && (
                        <Check size={16} className="text-primary" />
                      )}
                    </h4>
                    
                    {/* Theme Description */}
                    <p className="text-sm text-base-content/70 mt-1">
                      {themeOption.desc}
                    </p>
                    
                    {/* Color Preview */}
                    <div 
                      className="w-full h-3 rounded-full mt-3 border border-base-300" 
                      data-theme={themeOption.name}
                      style={{
                        background: 'linear-gradient(90deg, hsl(var(--p)), hsl(var(--s)), hsl(var(--a)))'
                      }}
                    />
                    
                    {/* Active Indicator */}
                    {theme === themeOption.name && (
                      <div className="badge badge-primary badge-sm mt-2">
                        Active
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Tips Section */}
        <div className="alert alert-info mt-8">
          <div className="flex items-center gap-2">
            <Sun className="text-info" size={20} />
            <div>
              <h4 className="font-semibold">Pro Tip:</h4>
              <p className="text-sm">Your theme preference is automatically saved and will be applied across all pages!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
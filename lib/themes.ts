// Define available themes
export type Theme = {
  name: string
  label: string
  className: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

export const themes: Theme[] = [
  {
    name: "default",
    label: "Default",
    className: "theme-default",
    colors: {
      primary: "hsl(222.2 47.4% 11.2%)",
      secondary: "hsl(210 40% 96.1%)",
      accent: "hsl(221.2 83.2% 53.3%)",
    },
  },
  {
    name: "rose",
    label: "Rose",
    className: "theme-rose",
    colors: {
      primary: "hsl(346 77% 49.8%)",
      secondary: "hsl(346 100% 97%)",
      accent: "hsl(346 77% 49.8%)",
    },
  },
  {
    name: "purple",
    label: "Purple",
    className: "theme-purple",
    colors: {
      primary: "hsl(262 83% 58%)",
      secondary: "hsl(262 100% 97%)",
      accent: "hsl(262 83% 58%)",
    },
  },
  {
    name: "green",
    label: "Green",
    className: "theme-green",
    colors: {
      primary: "hsl(142 71% 45%)",
      secondary: "hsl(142 100% 97%)",
      accent: "hsl(142 71% 45%)",
    },
  },
  {
    name: "orange",
    label: "Orange",
    className: "theme-orange",
    colors: {
      primary: "hsl(24 95% 58%)",
      secondary: "hsl(24 100% 97%)",
      accent: "hsl(24 95% 58%)",
    },
  },
]

export const getTheme = (themeName: string): Theme => {
  return themes.find((theme) => theme.name === themeName) || themes[0]
}


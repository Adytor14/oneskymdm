import reliantLogo from "@/assets/reliant-logo.png";
import opuscareLogo from "@/assets/opuscare-logo.png";
import choiceLogo from "@/assets/choice-logo.png";
import jethealthLogo from "@/assets/jethealth-logo.png";
import skyraLogo from "@/assets/skyra-logo.png";

export interface OrganizationTheme {
  id: string;
  name: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    headerBg: string;
    headerText: string;
    cardBg: string;
    iconColor: string;
  };
  tagline: string;
}

export const organizationThemes: Record<string, OrganizationTheme> = {
  reliant: {
    id: "reliant",
    name: "Reliant",
    logo: reliantLogo,
    colors: {
      primary: "hsl(200, 95%, 45%)",
      secondary: "hsl(200, 85%, 60%)",
      accent: "hsl(200, 70%, 50%)",
      headerBg: "linear-gradient(135deg, hsl(200, 95%, 45%), hsl(200, 85%, 60%))",
      headerText: "hsl(0, 0%, 100%)",
      cardBg: "hsl(200, 95%, 97%)",
      iconColor: "hsl(200, 95%, 45%)",
    },
    tagline: "Healthcare You Can Trust",
  },
  opuscare: {
    id: "opuscare",
    name: "Opuscare",
    logo: opuscareLogo,
    colors: {
      primary: "hsl(160, 65%, 45%)",
      secondary: "hsl(175, 60%, 50%)",
      accent: "hsl(160, 55%, 55%)",
      headerBg: "linear-gradient(135deg, hsl(160, 65%, 45%), hsl(175, 60%, 50%))",
      headerText: "hsl(0, 0%, 100%)",
      cardBg: "hsl(160, 60%, 97%)",
      iconColor: "hsl(160, 65%, 45%)",
    },
    tagline: "Compassionate Care, Exceptional Results",
  },
  choice: {
    id: "choice",
    name: "Choice",
    logo: choiceLogo,
    colors: {
      primary: "hsl(270, 70%, 55%)",
      secondary: "hsl(280, 65%, 60%)",
      accent: "hsl(270, 60%, 65%)",
      headerBg: "linear-gradient(135deg, hsl(270, 70%, 55%), hsl(280, 65%, 60%))",
      headerText: "hsl(0, 0%, 100%)",
      cardBg: "hsl(270, 65%, 97%)",
      iconColor: "hsl(270, 70%, 55%)",
    },
    tagline: "Your Health, Your Choice",
  },
  jethealth: {
    id: "jethealth",
    name: "Jethealth",
    logo: jethealthLogo,
    colors: {
      primary: "hsl(25, 95%, 55%)",
      secondary: "hsl(15, 90%, 60%)",
      accent: "hsl(25, 85%, 65%)",
      headerBg: "linear-gradient(135deg, hsl(25, 95%, 55%), hsl(15, 90%, 60%))",
      headerText: "hsl(0, 0%, 100%)",
      cardBg: "hsl(25, 90%, 97%)",
      iconColor: "hsl(25, 95%, 55%)",
    },
    tagline: "Fast Healthcare, Anywhere",
  },
  skyra: {
    id: "skyra",
    name: "Skyra",
    logo: skyraLogo,
    colors: {
      primary: "hsl(220, 100%, 30%)",
      secondary: "hsl(195, 85%, 50%)",
      accent: "hsl(220, 90%, 40%)",
      headerBg: "linear-gradient(135deg, hsl(220, 100%, 30%), hsl(195, 85%, 50%))",
      headerText: "hsl(0, 0%, 100%)",
      cardBg: "hsl(220, 95%, 97%)",
      iconColor: "hsl(220, 100%, 30%)",
    },
    tagline: "Intelligent Healthcare Analytics",
  },
  all: {
    id: "all",
    name: "OneSky",
    logo: skyraLogo, // Default to Skyra logo
    colors: {
      primary: "hsl(217, 91%, 60%)",
      secondary: "hsl(217, 85%, 70%)",
      accent: "hsl(217, 80%, 65%)",
      headerBg: "linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 85%, 70%))",
      headerText: "hsl(0, 0%, 100%)",
      cardBg: "hsl(217, 85%, 97%)",
      iconColor: "hsl(217, 91%, 60%)",
    },
    tagline: "One source. Endless referral intelligence",
  },
};

export const getOrganizationTheme = (orgId: string): OrganizationTheme => {
  return organizationThemes[orgId] || organizationThemes.all;
};

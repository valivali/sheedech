export const clerkAppearance = {
  variables: {
    colorPrimary: "#c49962",
    colorBackground: "#fdfcfb",
    colorInputBackground: "#fdfcfb",
    colorInputText: "#2c2416",
    colorText: "#2c2416",
    colorTextSecondary: "#6b5d4f",
    colorDanger: "#c87d5c",
    fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: { normal: 400, medium: 500, bold: 600 },
    borderRadius: "8px",
    fontSize: "15px",
  },
  elements: {
    card: {
      backgroundColor: "#fdfcfb",
      border: "1px solid #e8e3dc",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(139, 111, 71, 0.08)",
    },
    headerTitle: {
      color: "#2c2416",
      fontSize: "24px",
      fontWeight: 600,
    },
    headerSubtitle: {
      color: "#6b5d4f",
      fontSize: "15px",
    },
    formButtonPrimary: {
      backgroundColor: "#c49962",
      color: "#fdfcfb",
      fontSize: "15px",
      fontWeight: 500,
      borderRadius: "8px",
      padding: "12px 16px",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#8b6f47",
      },
      "&:active": {
        backgroundColor: "#8b6f47",
      },
    },
    formFieldInput: {
      backgroundColor: "#fdfcfb",
      borderColor: "#e8e3dc",
      borderWidth: "1.5px",
      borderRadius: "8px",
      color: "#2c2416",
      fontSize: "15px",
      padding: "12px 16px",
      "&:focus": {
        borderColor: "#c49962",
        boxShadow: "0 0 0 3px rgba(196, 153, 98, 0.1)",
      },
      "&:hover": {
        borderColor: "#d4cdc2",
      },
    },
    formFieldLabel: {
      color: "#2c2416",
      fontSize: "14px",
      fontWeight: 500,
    },
    footerActionLink: {
      color: "#c49962",
      fontWeight: 500,
      "&:hover": {
        color: "#8b6f47",
      },
    },
    identityPreviewText: {
      color: "#2c2416",
    },
    identityPreviewEditButton: {
      color: "#c49962",
      "&:hover": {
        color: "#8b6f47",
      },
    },
    socialButtonsBlockButton: {
      backgroundColor: "#fdfcfb",
      border: "1.5px solid #e8e3dc",
      borderRadius: "8px",
      color: "#2c2416",
      fontSize: "15px",
      fontWeight: 500,
      padding: "12px 16px",
      "&:hover": {
        backgroundColor: "#faf8f5",
        borderColor: "#d4cdc2",
      },
    },
    dividerLine: {
      backgroundColor: "#e8e3dc",
    },
    dividerText: {
      color: "#8b7d70",
      fontSize: "14px",
    },
    formFieldSuccessText: {
      color: "#9baa7f",
    },
    formFieldErrorText: {
      color: "#c87d5c",
      fontSize: "13px",
    },
    formFieldHintText: {
      color: "#8b7d70",
      fontSize: "13px",
    },
    modalBackdrop: {
      backgroundColor: "rgba(44, 36, 22, 0.6)",
      backdropFilter: "blur(4px)",
    },
    modalContent: {
      borderRadius: "16px",
    },
    badge: {
      backgroundColor: "rgba(196, 153, 98, 0.1)",
      color: "#8b6f47",
      borderRadius: "6px",
    },
  },
};


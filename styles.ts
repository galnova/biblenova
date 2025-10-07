import { StyleSheet, Platform, StatusBar, Dimensions } from "react-native";

/* ------------------------------------------------------------------ */
/* Tokens & responsive helpers                                         */
/* ------------------------------------------------------------------ */
const { width } = Dimensions.get("window");
const isTablet = width >= 768; // simple heuristic

const COLORS = {
  bg: "#0d0d0d",
  textPrimary: "#FFFFFF",
  textSecondary: "#D4D4D4",
  border: "#2A2A2A",
  ctaPrimary: "#0EA5E9",   // blue
  ctaSecondary: "#F59E0B", // amber
  ctaSuccess: "#22C55E",   // green
  btnTextDark: "#111111",
  danger: "#F87171",
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
export default StyleSheet.create({
  /* --------------------------- Layout / Page --------------------------- */
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  page: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },
  pageBody: {
    flex: 1,
  },
  // For absolute footer pages
  pageBodyRelative: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.bg,
  },
  centerArea: {
    flexGrow: 1,
    justifyContent: "center",
  },

  /* ----------------------------- Top Bar ------------------------------ */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 8,
  },
  backBtn: {
    backgroundColor: COLORS.ctaSecondary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
    minHeight: 44,
    justifyContent: "center",
  },
  backBtnText: {
    color: COLORS.btnTextDark,
    fontWeight: "bold",
    fontSize: 16,
  },
  backBtnIcon: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnArrow: { marginTop: -2 },
  topBarInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#666",
    color: COLORS.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 120,
    minHeight: 44,
    fontSize: 16,
  },
  topBarHamburger: { padding: 12 },
  topBarHamburgerText: { fontSize: 22, color: COLORS.textPrimary },

  /* -------------------------- Typography ------------------------------ */
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  intro: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    paddingBottom: 16,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  mutedText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  strong: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 16,
  },
  progressText: {
    color: COLORS.textSecondary,
    marginTop: 8,
  },

  /* --------------------------- Cards / Grid --------------------------- */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#171717",
    padding: 8,
    margin: 8,
    borderRadius: 12,
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
  },

  /* ------------------------ Lists / Verses UI ------------------------- */
  item: {
    backgroundColor: "#171717",
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  verse: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
  },
  verseNumber: {
    color: COLORS.textPrimary,
    fontWeight: "bold",
    marginRight: 8,
  },

  /* ---------------------- Verse of the Day (VOD) ---------------------- */
  vodScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  vodTitle: { marginTop: 16 },
  vodReference: {
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontSize: 16,
  },
  vodError: { color: COLORS.danger, marginTop: 12, fontSize: 16 },
  vodBodyText: { color: COLORS.textPrimary, lineHeight: 24, fontSize: 16 },
  vodAttribution: { color: "#A3A3A3", marginTop: 8, fontSize: 14 },

  /* ----------------------------- Buttons ------------------------------ */
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
    marginTop: 12,
  },
  buttonRowUnder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    width: "100%",
    marginTop: 12,
  },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  btnFullWidth: { width: "100%" },
  btnHalf: { width: "48%" },
  btnResponsive: { width: isTablet ? "48%" : "100%" },

  btnPrimary: { backgroundColor: COLORS.ctaPrimary },
  btnSecondary: { backgroundColor: COLORS.ctaSecondary },
  btnSuccess: { backgroundColor: COLORS.ctaSuccess },

  btnTextDark: {
    color: COLORS.btnTextDark,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  /* ----------------------------- Footer ------------------------------- */
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  // absolute, pinned footer pattern
  footerAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
  },
  // spacer to prevent content being hidden behind absolute footer
  footerSpacer: {
    height: 80,
  },

  /* ----------------------------- Spacers ------------------------------ */
  spacer20: { height: 20 },

  /* ------------------------- Utility containers ----------------------- */
  sectionWrap: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 6 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  loadingWrap: { padding: 16 },
  emptyWrap: { paddingHorizontal: 16, paddingVertical: 8 },
});

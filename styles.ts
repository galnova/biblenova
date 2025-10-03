import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0d0d0d',
  },

  // 🔹 Top bar (back + input + hamburger in one row)
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 8,
  },

  backBtn: {
    backgroundColor: '#facc15',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,   // gap before input
  },
  backBtnText: {
    color: '#111',
    fontWeight: 'bold',
  },

  // 🔹 Extra style for icon-only back buttons
  backBtnIcon: {
    height: 40,               // square button
    width: 40,
    justifyContent: 'center', // centers vertically
    alignItems: 'center',     // centers horizontally
    paddingVertical: 0,       // override text padding
    paddingHorizontal: 0,
  },

  // 🔹 Nudge the FontAwesome arrow itself
  backBtnArrow: {
    marginTop: -2,            // 👈 adjust this up/down until visually centered
  },

  topBarInput: {
    flex: 1,                // fill remaining space
    borderWidth: 1,
    borderColor: '#666',
    color: '#fff',
    padding: 6,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 100,          // prevents collapsing too much
  },

  topBarHamburger: {
    padding: 12,
  },
  topBarHamburgerText: {
    fontSize: 22,
    color: '#fff',
  },

  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00f2ea',
    marginBottom: 8,
    marginTop: 0,
    textAlign: 'center',
  },

  intro: {
    fontSize: 16,
    color: '#e5e5e5',
    marginBottom: 20,
    textAlign: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#171717',
    padding: 5,
    margin: 8,
    borderRadius: 12,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  page: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 16,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    paddingBottom: 16,
  },

  // 🔹 For Bible list & verses
  item: {
    backgroundColor: '#171717',
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  verse: {
    color: '#e5e5e5',
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
// verseNumber: {
//   backgroundColor: "#facc15", // yellow bg
//   color: "#000",              // black number
//   fontWeight: "bold",
//   borderRadius: 9999,         // force full circle
//   paddingHorizontal: 8,       // left/right padding
//   paddingVertical: 4,         // top/bottom padding
//   marginRight: 16,            // gap before verse text
//   overflow: "hidden",         // clip overflow
// },

});

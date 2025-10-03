import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d0d', // ensures top/bottom use dark background
  },
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00f2ea',
    marginBottom: 8,
    marginTop: 40, // ⬅️ pushes title lower under the clock/camera
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
  height: 100,            // ⬅️ add a fixed height for vertical centering
  alignItems: 'center',   // ⬅️ centers horizontally
  justifyContent: 'center', // ⬅️ centers vertically
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
    marginTop: 20,
  },
  backBtn: {
    backgroundColor: '#facc15',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 40, // ⬅️ pushes back button lower below status bar
  },
  backBtnText: {
    color: '#111',
    fontWeight: 'bold',
  },
});

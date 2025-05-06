import { Colors } from "@/constants/Colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useBottomSheet } from "@/context/BottomSheetContext";

/**
 * Fab (Floating Action Button) component.
 *
 * This component renders a circular button, typically positioned at the
 * bottom-right of the screen, used for a primary action like adding a new item.
 * When pressed, it triggers a light haptic feedback and expands a bottom sheet
 * whose reference is obtained from `BottomSheetContext`.
 *
 * @component
 * @example
 * ```tsx
 * // In your screen component:
 * // Ensure Gorhom's BottomSheetModalProvider is at a higher level in your app tree.
 *
 * import React, { useRef, useMemo } from 'react';
 * import { View, Text, Button, StyleSheet } from 'react-native';
 * import { BottomSheetModal } from '@gorhom/bottom-sheet';
 * import { BottomSheetProvider } from '@/context/BottomSheetContext'; // Your custom context provider
 * import Fab from '@/components/Fab'; // The component being documented
 *
 * const MyScreenWithFab = () => {
 *   const bottomSheetModalRef = useRef<BottomSheetModal>(null);
 *
 *   // Example snap points for the bottom sheet
 *   const snapPoints = useMemo(() => ['25%', '50%'], []);
 *
 *   return (
 *     <BottomSheetProvider bottomSheetRef={bottomSheetModalRef}>
 *       <View style={styles.container}>
 *         <Text>Screen Content</Text>
 *         <Text>Press the FAB to open the bottom sheet.</Text>
 *
 *         <Fab />
 *
 *         <BottomSheetModal
 *           ref={bottomSheetModalRef}
 *           index={-1} // Initially hidden
 *           snapPoints={snapPoints}
 *           // enablePanDownToClose={true} // Optional: allows dismissing by panning down
 *         >
 *           <View style={styles.bottomSheetContent}>
 *             <Text style={styles.bottomSheetTitle}>Bottom Sheet Content</Text>
 *             <Text>This is the content revealed by the FAB.</Text>
 *             <Button title="Close Sheet" onPress={() => bottomSheetModalRef.current?.close()} />
 *           </View>
 *         </BottomSheetModal>
 *       </View>
 *     </BottomSheetProvider>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     justifyContent: 'center',
 *     alignItems: 'center',
 *   },
 *   bottomSheetContent: {
 *     padding: 20,
 *     backgroundColor: 'white', // Or your theme's background
 *     height: '100%', // Ensure content fills the snap point
 *     alignItems: 'center',
 *   },
 *   bottomSheetTitle: {
 *     fontSize: 18,
 *     fontWeight: 'bold',
 *     marginBottom: 10,
 *   }
 * });
 *
 * export default MyScreenWithFab;
 * ```
 */
const Fab = () => {
  const { bottomSheetRef } = useBottomSheet(); // Get ref from context

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.expand(); // Expand the bottom sheet to the first snap point
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default Fab;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 15,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.2)",
  },
});

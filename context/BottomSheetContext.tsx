import React, { createContext, useRef, useContext, ReactNode } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

interface BottomSheetContextType {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
}; 
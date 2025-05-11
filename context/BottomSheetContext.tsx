import React, { createContext, useRef, useContext, ReactNode, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Todo } from '@/types/interfaces';

interface BottomSheetContextType {
  bottomSheetRef: React.RefObject<BottomSheet>;
  openBottomSheetWithTask: (task: Todo) => void; // open the bottom sheet with a task
  selectedTask: Todo | null; // State to hold the task for the bottom sheet
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null); // State for the task to be displayed in the bottom sheet

  // Function to open the bottom sheet with a task
 const openBottomSheetWithTask = (task: Todo) => {
    bottomSheetRef.current?.snapToIndex(1);
    setSelectedTask(task);
  };

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef, openBottomSheetWithTask, selectedTask }}>
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

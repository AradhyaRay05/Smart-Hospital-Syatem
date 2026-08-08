"use client";

import { useState, useCallback } from "react";

export function useConfirm() {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback(({ title, description }) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title,
        description,
        onConfirm: () => {
          setState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return { ...state, confirm };
}

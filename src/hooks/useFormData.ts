'use client';

import { useState, useCallback } from 'react';
import { FormData, TabField } from '@/types/admin/form';

export const useFormData = (initialTabs: TabField[]) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const initial: FormData = {};
    initialTabs.forEach((tab) => {
      initial[tab.formKey] = [{ ...tab.defaultItem }];
    });
    return initial;
  });

  const [usedOptions, setUsedOptions] = useState<Record<string, Set<any>>>({});

  const updateUsedOptions = useCallback((tabKey: string, fieldName: string, values: any[]) => {
    setUsedOptions((prev) => {
      const newOptions = new Set<any>();
      if (Array.isArray(values)) {
        values.forEach((item) => {
          if (item && item[fieldName] !== undefined && item[fieldName] !== null) {
            newOptions.add(item[fieldName]);
          }
        });
      }
      return {
        ...prev,
        [`${tabKey}_${fieldName}`]: newOptions,
      };
    });
  }, []);

  const addItem = useCallback((tabKey: string, defaultItem: any) => {
    setFormData((prev) => ({
      ...prev,
      [tabKey]: [...(prev[tabKey] || []), { ...defaultItem }],
    }));
  }, []);

  const removeItem = useCallback((tabKey: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [tabKey]: prev[tabKey].filter((_, i) => i !== index),
    }));
  }, []);

  return {
    formData,
    setFormData,
    usedOptions,
    updateUsedOptions,
    addItem,
    removeItem,
  };
};
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";

interface Branch {
  id: string;
  name: string;
  location: string;
}

interface BranchContextType {
  activeBranch: Branch | null;
  setActiveBranch: (branch: Branch | null) => void;
  branches: Branch[];
}

const BranchContext = createContext<BranchContextType>({
  activeBranch: null,
  setActiveBranch: () => {},
  branches: [],
});

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    // Fetch all branches
    const loadBranches = async () => {
      try {
        const data = await api.get('/branches/');
        setBranches(data);
        
        // Load saved branch from local storage if exists
        const savedBranchId = localStorage.getItem('activeBranchId');
        if (savedBranchId) {
          const matchedBranch = data.find((b: Branch) => b.id.toString() === savedBranchId);
          if (matchedBranch) setActiveBranchState(matchedBranch);
        }
      } catch (err) {
        console.error("Failed to load branches for context", err);
      }
    };
    loadBranches();
  }, []);

  const setActiveBranch = (branch: Branch | null) => {
    setActiveBranchState(branch);
    if (branch) {
      localStorage.setItem('activeBranchId', branch.id.toString());
    } else {
      localStorage.removeItem('activeBranchId');
    }
  };

  return (
    <BranchContext.Provider value={{ activeBranch, setActiveBranch, branches }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => useContext(BranchContext);

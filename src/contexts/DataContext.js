import { createContext, useMemo, useState } from "react";

export const DataContext = createContext({
    uploadCount: 0,
    setUploadCount: () => {},
});

export function DataProvider({ children }) {
    const [uploadCount, setUploadCount] = useState(0);

    const data = useMemo(
        () => ({ uploadCount, setUploadCount }),
        [uploadCount]
    );

    return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

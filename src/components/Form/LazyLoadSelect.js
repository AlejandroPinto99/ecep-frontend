import React, { useState } from "react";
import WindowedSelect from "react-windowed-select";

const LazyLoadSelect = ({ methods, index, selectOptions, className, onChange }) => {
    const [options, setOptions] = useState(selectOptions);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Simular la carga de datos
    const loadMoreOptions = (currentOptions) => {
        if (loading || !hasMore) return;

        setLoading(true);
        setTimeout(() => {
        setOptions([...currentOptions]);

        setLoading(false);
        }, 1000);
    };

    return (
        <WindowedSelect
            options={options}
            className={className}
            onChange={onChange}
            onMenuScrollToBottom={() => loadMoreOptions(options)}
            isLoading={loading}
            placeholder=""
            defaultOptions // Muestra las primeras opciones mientras se cargan más
        />
    );
};

export default LazyLoadSelect;

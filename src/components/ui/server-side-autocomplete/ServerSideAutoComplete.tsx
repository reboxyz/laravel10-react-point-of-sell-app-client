import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { observer } from "mobx-react-lite";

interface ServerSideAutocompleteProps {
  label: string;
  ajaxCallFn: Function;
  onOptionSelect: (option: any) => void;
  error: any;
  field: any;
}

const ServerSideAutocomplete: React.FC<ServerSideAutocompleteProps> = ({
  label,
  ajaxCallFn,
  onOptionSelect,
  error,
  field,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const response = await ajaxCallFn({ search: inputValue });
      setLoading(false);
      return response;
    };

    const fetchData = async () => {
      try {
        const response = await fetchOptions();
        setOptions(response);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchData();
  }, [inputValue, onOptionSelect, ajaxCallFn]);

  const handleKeyUp = (e: any) => {
    setInputValue(e.target.value);
  };

  return (
    <Autocomplete
      {...field}
      options={options}
      loading={loading}
      getOptionLabel={(option: any) => option.label ?? ""}
      isOptionEqualToValue={(option: any, value: any) =>
        option.id === value.id && option.label === value.label
      }
      filterOptions={(x) => x}
      onKeyUp={handleKeyUp}
      onChange={(_, newValue) => {
        onOptionSelect(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="filled"
          fullWidth
          error={!!error}
          helperText={error?.message}
          autoComplete="new-password"
          autoFocus={false}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default observer(ServerSideAutocomplete);

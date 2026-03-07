import useSWR from "swr";

interface HealthData {
  status: "ok";
  checkedAt: string;
}

const fetcher = (): HealthData => ({
  status: "ok",
  checkedAt: new Date().toISOString(),
});

export function useHealthCheck() {
  const { data, error, isLoading } = useSWR<HealthData>(
    "health-check",
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: !!error,
  };
}

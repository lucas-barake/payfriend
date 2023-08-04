import React from "react";
import { Button } from "$/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import _ from "lodash";
import { DEBTS_QUERY_PAGINATION_LIMIT } from "$/server/api/routers/debts/queries/handlers/lib/constants";

const INTERVAL = 1_000; // 1 second

type Props = {
  page: number;
  setPage: (page: number) => void;
  count: number;
};

const PageControls: React.FC<Props> = ({ page, setPage, count }) => {
  const debouncedNextPage = React.useCallback(
    _.debounce(
      () => {
        setPage(page + 1);
      },
      INTERVAL,
      { leading: true, maxWait: INTERVAL }
    ),
    [setPage]
  );

  const debouncedPreviousPage = React.useCallback(
    _.debounce(
      () => {
        setPage(page - 1);
      },
      INTERVAL,
      { leading: true, maxWait: INTERVAL }
    ),
    [setPage]
  );

  const itemsPerPage = DEBTS_QUERY_PAGINATION_LIMIT;
  const canShowNextButton = (page + 1) * itemsPerPage < count;

  return (
    <div className="flex items-center justify-end gap-2">
      {page !== 0 && (
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={debouncedPreviousPage}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Anterior
        </Button>
      )}

      {canShowNextButton && (
        <Button variant="outline" size="sm" onClick={debouncedNextPage}>
          Siguiente
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PageControls;

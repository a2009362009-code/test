import { getResourceConfigByKey } from "../config/resources";
import { ResourcePage } from "./ResourcePage";

export function ResourceByKeyPage({ resourceKey }: { resourceKey: string }) {
  const config = getResourceConfigByKey(resourceKey);

  if (!config) {
    return <div className="panel-error">Конфиг ресурса {resourceKey} не найден.</div>;
  }

  return <ResourcePage config={config} />;
}

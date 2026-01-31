interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  props: PropDefinition[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              Prop
            </th>
            <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              Type
            </th>
            <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              Default
            </th>
            <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td className="px-4 py-3 border-b border-gray-200 align-top">
                <code className="font-semibold text-gray-900">
                  {prop.name}
                  {prop.required && <span className="text-red-600 ml-0.5">*</span>}
                </code>
              </td>
              <td className="px-4 py-3 border-b border-gray-200 align-top">
                <code className="text-emerald-600 text-[13px]">{prop.type}</code>
              </td>
              <td className="px-4 py-3 border-b border-gray-200 align-top">
                {prop.default ? (
                  <code className="text-violet-600 text-[13px]">{prop.default}</code>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 align-top text-gray-600 leading-relaxed">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { PropDefinition };

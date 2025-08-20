import { GlobeAltIcon ,BuildingLibraryIcon} from '@heroicons/react/24/outline';
import { lusitana } from 'app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <BuildingLibraryIcon className="h-15 w-15 rotate-[0deg]" />
      <p className="text-[30px]">Easy School</p>
    </div>
  );
}

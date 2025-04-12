import { SectionLayout } from '@/components/ui/section-layout';

function GhostSection() {
  return (
    <SectionLayout id="ghost" title="GHOST">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div>images</div>
        <div className="col-span-2">
          <div>
            <p className="text-muted font-heading text-center text-7xl font-extrabold xl:text-[220px]">
              GHOST
            </p>
          </div>

          <h3>Organizacja studencka przy Politechnice Poznaskiej</h3>
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur. Mi sagittis pretium varius
            est nisi euismod dignissim. Ultrices turpis nec pellentesque dui
            tellus egestas sed pellentesque tortor. Tellus dolor eleifend
            volutpat purus sit netus auctor. Bibendum cras malesuada suspendisse
            pellentesque a ullamcorper.
            <br />
            <br />
            At fermentum libero elementum id. Posuere eget nec interdum mauris
            pellentesque adipiscing neque. Enim ut porta velit amet id ante. Sed
            tempor porttitor urna sociis et enim nulla. Placerat ac senectus
            vivamus in laoreet posuere interdum.
            <br />
            <br /> Maecenas quis ut sit interdum etiam nec urna mollis ipsum.
            Vitae pellentesque diam diam ut nibh et. Purus nullam posuere
            sodales elit pellentesque. Pellentesque viverra neque viverra
            commodo lacus aliquam.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}

export { GhostSection };

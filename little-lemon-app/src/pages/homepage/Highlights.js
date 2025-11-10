import Button from '../../components/ui/button/Button';
import CardGallery from '../../components/ui/card/CardGallery';

export default function Highlights() {
    return (
        <section className='highlights-section'>
            <div className='announcement'>
                <div>
                    <span className='section-eyebrow'>Chef&apos;s spotlight</span>
                    <h2>Limited-run tasting flights</h2>
                    <p>
                        We rotate our mezze flights weekly around peak-season ingredients.
                        Book ahead to catch this week&apos;s pairings before they sell out.
                    </p>
                </div>
                <Button color='orderButtonColor highlights-button' text='View tasting menu' />
            </div>
            <CardGallery />
        </section>
    );
}
